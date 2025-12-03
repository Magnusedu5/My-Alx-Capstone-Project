"""
Google Drive Integration Utility
Handles file uploads, downloads, and management with Google Drive
"""

import os
import io
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload, MediaIoBaseUpload
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from django.conf import settings

# Scopes for Google Drive API
SCOPES = ['https://www.googleapis.com/auth/drive.file']

# Token and credentials paths
TOKEN_PATH = os.path.join(settings.BASE_DIR, 'token.pickle')
CREDENTIALS_PATH = os.path.join(settings.BASE_DIR, 'credentials.json')


class GoogleDriveService:
    """Service class for Google Drive operations"""
    
    def __init__(self):
        self.service = self._get_drive_service()
    
    def _get_drive_service(self):
        """Authenticate and return Google Drive service instance"""
        creds = None
        
        # Load existing token
        if os.path.exists(TOKEN_PATH):
            creds = Credentials.from_authorized_user_file(TOKEN_PATH, SCOPES)
        
        # Refresh or create new credentials if needed
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                if not os.path.exists(CREDENTIALS_PATH):
                    raise FileNotFoundError(
                        f"Credentials file not found at {CREDENTIALS_PATH}. "
                        "Please add your Google OAuth credentials."
                    )
                flow = InstalledAppFlow.from_client_secrets_file(
                    CREDENTIALS_PATH, SCOPES
                )
                creds = flow.run_local_server(port=0)
            
            # Save the credentials for the next run
            with open(TOKEN_PATH, 'w') as token:
                token.write(creds.to_json())
        
        return build('drive', 'v3', credentials=creds)
    
    def create_folder(self, folder_name, parent_folder_id=None):
        """
        Create a folder in Google Drive
        
        Args:
            folder_name (str): Name of the folder to create
            parent_folder_id (str): Optional parent folder ID
            
        Returns:
            str: ID of the created folder
        """
        file_metadata = {
            'name': folder_name,
            'mimeType': 'application/vnd.google-apps.folder'
        }
        
        if parent_folder_id:
            file_metadata['parents'] = [parent_folder_id]
        
        folder = self.service.files().create(
            body=file_metadata,
            fields='id'
        ).execute()
        
        return folder.get('id')
    
    def upload_file(self, file_path=None, file_object=None, filename=None, 
                   folder_id=None, mimetype=None):
        """
        Upload a file to Google Drive
        
        Args:
            file_path (str): Path to file on disk (for traditional uploads)
            file_object: Django UploadedFile object or file-like object
            filename (str): Name for the file in Google Drive
            folder_id (str): Optional folder ID to upload to
            mimetype (str): MIME type of the file
            
        Returns:
            dict: File information including 'id', 'name', and 'webViewLink'
        """
        file_metadata = {'name': filename or 'Untitled'}
        
        if folder_id:
            file_metadata['parents'] = [folder_id]
        
        # Handle Django UploadedFile or file-like objects
        if file_object:
            # Reset file pointer to beginning
            file_object.seek(0)
            
            # Create media upload from file object
            media = MediaIoBaseUpload(
                file_object,
                mimetype=mimetype or 'application/octet-stream',
                resumable=True
            )
        elif file_path:
            # Upload from file path
            media = MediaFileUpload(
                file_path,
                mimetype=mimetype or 'application/octet-stream',
                resumable=True
            )
        else:
            raise ValueError("Either file_path or file_object must be provided")
        
        # Upload the file
        file = self.service.files().create(
            body=file_metadata,
            media_body=media,
            fields='id, name, webViewLink, webContentLink'
        ).execute()
        
        # Make file accessible with link
        self.service.permissions().create(
            fileId=file.get('id'),
            body={
                'type': 'anyone',
                'role': 'reader'
            }
        ).execute()
        
        return {
            'id': file.get('id'),
            'name': file.get('name'),
            'webViewLink': file.get('webViewLink'),
            'webContentLink': file.get('webContentLink')
        }
    
    def delete_file(self, file_id):
        """
        Delete a file from Google Drive
        
        Args:
            file_id (str): ID of the file to delete
            
        Returns:
            bool: True if successful
        """
        try:
            self.service.files().delete(fileId=file_id).execute()
            return True
        except Exception as e:
            print(f"Error deleting file {file_id}: {e}")
            return False
    
    def get_file_link(self, file_id):
        """
        Get the web view link for a file
        
        Args:
            file_id (str): ID of the file
            
        Returns:
            str: Web view link
        """
        try:
            file = self.service.files().get(
                fileId=file_id,
                fields='webViewLink, webContentLink'
            ).execute()
            return {
                'webViewLink': file.get('webViewLink'),
                'webContentLink': file.get('webContentLink')
            }
        except Exception as e:
            print(f"Error getting file link {file_id}: {e}")
            return None
    
    def get_file_metadata(self, file_id):
        """
        Get metadata for a file
        
        Args:
            file_id (str): ID of the file
            
        Returns:
            dict: File metadata
        """
        try:
            file = self.service.files().get(
                fileId=file_id,
                fields='id, name, mimeType, size, createdTime, webViewLink, webContentLink'
            ).execute()
            return file
        except Exception as e:
            print(f"Error getting file metadata {file_id}: {e}")
            return None


# Singleton instance
_drive_service = None

def get_drive_service():
    """Get or create the Google Drive service instance"""
    global _drive_service
    if _drive_service is None:
        _drive_service = GoogleDriveService()
    return _drive_service


# Convenience functions
def upload_to_drive(file_object, filename, folder_id=None, mimetype=None):
    """
    Upload a file to Google Drive (convenience function)
    
    Args:
        file_object: Django UploadedFile or file-like object
        filename (str): Name for the file
        folder_id (str): Optional folder ID
        mimetype (str): MIME type
        
    Returns:
        dict: File information
    """
    service = get_drive_service()
    return service.upload_file(
        file_object=file_object,
        filename=filename,
        folder_id=folder_id,
        mimetype=mimetype
    )


def delete_from_drive(file_id):
    """
    Delete a file from Google Drive (convenience function)
    
    Args:
        file_id (str): ID of the file to delete
        
    Returns:
        bool: True if successful
    """
    service = get_drive_service()
    return service.delete_file(file_id)


def get_drive_link(file_id):
    """
    Get the web view link for a file (convenience function)
    
    Args:
        file_id (str): ID of the file
        
    Returns:
        dict: Links for the file
    """
    service = get_drive_service()
    return service.get_file_link(file_id)
