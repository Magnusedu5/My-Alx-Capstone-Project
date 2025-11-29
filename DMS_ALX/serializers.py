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

    class Meta:
        model = Document
        fields = ['id', 'title', 'description', 'file', 'status', 'status_display',
                 'upload_date', 'uploaded_by']
        read_only_fields = ['id', 'upload_date', 'uploaded_by', 'status']

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
        # Remove category from validated_data and add to description
        category = validated_data.pop('category', '')
        if category:
            description = validated_data.get('description', '')
            validated_data['description'] = f"Category: {category}\n{description}".strip()

        validated_data['uploaded_by'] = self.context['request'].user
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

    class Meta:
        model = Result
        fields = ['id', 'course_code', 'course_title', 'session', 'session_name',
                 'semester', 'semester_display', 'file', 'status', 'status_display',
                 'upload_date', 'updated_at', 'uploaded_by']
        read_only_fields = ['id', 'upload_date', 'updated_at', 'uploaded_by', 'status']


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
        # Handle session - find or create session by name
        session_name = validated_data.pop('session')
        session, created = Session.objects.get_or_create(name=session_name)
        validated_data['session'] = session

        # Remove level field (not in model, just for frontend)
        validated_data.pop('level', None)

        # Set the uploaded_by field
        validated_data['uploaded_by'] = self.context['request'].user

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