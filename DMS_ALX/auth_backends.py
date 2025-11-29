from typing import Optional
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.db.models import Q


class EmailOrUsernameModelBackend(ModelBackend):
    """Authenticate using either username or email.

    This backend falls back to the default `ModelBackend` behaviour if no
    matching user is found by email.
    """

    def authenticate(self, request, username: Optional[str] = None, password: Optional[str] = None, **kwargs):
        UserModel = get_user_model()
        if username is None:
            username = kwargs.get(UserModel.USERNAME_FIELD)
        if username is None or password is None:
            return None

        # Prefer exact username match first to avoid ambiguity when multiple
        # users share the same email address. Fall back to email lookup and
        # pick a single candidate (prefer active users) to avoid raising
        # MultipleObjectsReturned.
        user = UserModel.objects.filter(username__iexact=username).first()

        if user is None:
            # Find users matching the email (case-insensitive). Order so that
            # active users come first.
            candidates = list(UserModel.objects.filter(email__iexact=username).order_by('-is_active'))
            if not candidates:
                return None
            user = candidates[0]

        if user.check_password(password) and self.user_can_authenticate(user):
            return user

        return None
