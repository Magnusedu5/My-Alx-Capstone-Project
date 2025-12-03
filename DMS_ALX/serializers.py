from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomUser, Document, Result, Session, Department


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for CustomUser model - converts User objects to/from JSON
    Used for returning user profile information in API responses
    """
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'department']
        read_only_fields = ['id']

    def to_representation(self, instance):
        """
        Override to include department name instead of just ID
        """
        representation = super().to_representation(instance)
        if instance.department:
            representation['department'] = instance.department.name
        return representation


class LoginSerializer(serializers.Serializer):
    """
    Serializer for user login - validates email/password credentials
    """
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            # Try to find user by email
            try:
                user = CustomUser.objects.get(email=email)
                username = user.username
            except CustomUser.DoesNotExist:
                raise serializers.ValidationError('Invalid credentials')

            # Authenticate with username (since Django auth uses username)
            user = authenticate(username=username, password=password)

            if user:
                if not user.is_active:
                    raise serializers.ValidationError('User account is disabled')
                attrs['user'] = user
                return attrs
            else:
                raise serializers.ValidationError('Invalid credentials')
        else:
            raise serializers.ValidationError('Must provide email and password')


class DocumentSerializer(serializers.ModelSerializer):
    """
    Serializer for Document model - handles document upload and listing
    """
    uploaded_by = UserSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Document
        fields = ['id', 'title', 'description', 'file', 'status', 'status_display',
                 'upload_date', 'uploaded_by', 'gdrive_file_id', 'gdrive_file_url', 
                 'original_filename', 'file_url']
        read_only_fields = ['id', 'upload_date', 'uploaded_by', 'status', 'gdrive_file_id', 
                           'gdrive_file_url', 'original_filename', 'file_url']

    def get_file_url(self, obj):
        """Return the appropriate file URL (Google Drive or local)"""
        # Priority: Google Drive > Local file
        if obj.gdrive_file_url:
            return obj.gdrive_file_url
        elif obj.file:
            # Build absolute URL for local files
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None

    def create(self, validated_data):
        """
        Override create to automatically set the uploaded_by field
        """
        validated_data['uploaded_by'] = self.context['request'].user
        return super().create(validated_data)


class DocumentUploadSerializer(serializers.ModelSerializer):
    """
    Simplified serializer specifically for document uploads
    """
    class Meta:
        model = Document
        fields = ['title', 'description', 'file', 'category']

    # Add category field for frontend (stored in description for now)
    category = serializers.CharField(required=False, write_only=True)

    def create(self, validated_data):
        from .utils.google_drive import upload_to_drive
        
        # Remove category from validated_data and add to description
        category = validated_data.pop('category', '')
        if category:
            description = validated_data.get('description', '')
            validated_data['description'] = f"Category: {category}\n{description}".strip()

        validated_data['uploaded_by'] = self.context['request'].user
        
        # Get the uploaded file
        file_obj = validated_data.get('file')
        
        if file_obj:
            try:
                # Upload to Google Drive - Documents folder
                drive_result = upload_to_drive(
                    file_object=file_obj,
                    filename=file_obj.name,
                    mimetype=file_obj.content_type,
                    folder_type='documents'  # Upload to Academic Hub/Documents
                )
                
                # Store Google Drive information
                validated_data['gdrive_file_id'] = drive_result['id']
                validated_data['gdrive_file_url'] = drive_result['webViewLink']
                validated_data['original_filename'] = file_obj.name
                
                # Clear the file field since we're using Google Drive
                validated_data['file'] = None
                
                print(f"✅ Document '{file_obj.name}' uploaded to Google Drive/Academic Hub/Documents")
                
            except Exception as e:
                # If Google Drive upload fails, fall back to local storage
                print(f"❌ Google Drive upload failed: {e}. Using local storage.")
        
        return super().create(validated_data)


class SessionSerializer(serializers.ModelSerializer):
    """
    Serializer for Session model
    """
    class Meta:
        model = Session
        fields = ['id', 'name']


class ResultSerializer(serializers.ModelSerializer):
    """
    Serializer for Result model - handles result upload and listing
    """
    uploaded_by = UserSerializer(read_only=True)
    session_name = serializers.CharField(source='session.name', read_only=True)
    semester_display = serializers.CharField(source='get_semester_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Result
        fields = ['id', 'course_code', 'course_title', 'session', 'session_name',
                 'semester', 'semester_display', 'file', 'status', 'status_display',
                 'upload_date', 'updated_at', 'uploaded_by', 'gdrive_file_id', 
                 'gdrive_file_url', 'original_filename', 'file_url']
        read_only_fields = ['id', 'upload_date', 'updated_at', 'uploaded_by', 'status',
                           'gdrive_file_id', 'gdrive_file_url', 'original_filename', 'file_url']

    def get_file_url(self, obj):
        """Return the appropriate file URL (Google Drive or local)"""
        # Priority: Google Drive > Local file
        if obj.gdrive_file_url:
            return obj.gdrive_file_url
        elif obj.file:
            # Build absolute URL for local files
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None


class ResultUploadSerializer(serializers.ModelSerializer):
    """
    Simplified serializer specifically for result uploads
    """
    session = serializers.CharField()  # Accept session name as string
    level = serializers.CharField(required=False, write_only=True)  # Optional level field

    class Meta:
        model = Result
        fields = ['course_code', 'course_title', 'session', 'semester', 'file', 'level']

    def create(self, validated_data):
        from .utils.google_drive import upload_to_drive
        
        # Handle session - find or create session by name
        session_name = validated_data.pop('session')
        session, created = Session.objects.get_or_create(name=session_name)
        validated_data['session'] = session

        # Remove level field (not in model, just for frontend)
        validated_data.pop('level', None)

        # Set the uploaded_by field
        validated_data['uploaded_by'] = self.context['request'].user
        
        # Get the uploaded file
        file_obj = validated_data.get('file')
        
        if file_obj:
            try:
                # Upload to Google Drive - Results folder
                drive_result = upload_to_drive(
                    file_object=file_obj,
                    filename=file_obj.name,
                    mimetype=file_obj.content_type,
                    folder_type='results'  # Upload to Academic Hub/Results
                )
                
                # Store Google Drive information
                validated_data['gdrive_file_id'] = drive_result['id']
                validated_data['gdrive_file_url'] = drive_result['webViewLink']
                validated_data['original_filename'] = file_obj.name
                
                # Clear the file field since we're using Google Drive
                validated_data['file'] = None
                
                print(f"✅ Result '{file_obj.name}' uploaded to Google Drive/Academic Hub/Results")
                
            except Exception as e:
                # If Google Drive upload fails, fall back to local storage
                print(f"❌ Google Drive upload failed: {e}. Using local storage.")

        return super().create(validated_data)

    def validate_semester(self, value):
        """
        Validate semester field - convert frontend values to model values
        """
        semester_mapping = {
            'first': 'First',
            'second': 'Second',
            'First': 'First',
            'Second': 'Second'
        }

        mapped_value = semester_mapping.get(value.lower())
        if not mapped_value:
            raise serializers.ValidationError('Invalid semester. Choose "first" or "second".')

        return mapped_value


class DashboardSerializer(serializers.Serializer):
    """
    Serializer for dashboard data - combines various statistics
    """
    total_documents = serializers.IntegerField(read_only=True)
    total_results = serializers.IntegerField(read_only=True)
    pending_approvals = serializers.IntegerField(read_only=True)
    recent_uploads = serializers.IntegerField(read_only=True)
    user = UserSerializer(read_only=True)
    role = serializers.CharField(read_only=True)