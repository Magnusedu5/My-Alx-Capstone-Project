from django.core.management.base import BaseCommand
from DMS_ALX.models import CustomUser


class Command(BaseCommand):
    help = 'Create demo HOD and Staff users (non-interactive)'

    def handle(self, *args, **options):
        # Update existing demo users' passwords or create new ones
        hod_user, created = CustomUser.objects.get_or_create(
            username='demo_hod',
            defaults={'email': 'hod@demo.local', 'role': 'HOD'}
        )
        hod_user.set_password('demo123')
        hod_user.email = 'hod@demo.local'
        hod_user.role = 'HOD'
        hod_user.save()
        
        if created:
            self.stdout.write(self.style.SUCCESS('Created demo_hod (Email: hod@demo.local | Password: demo123)'))
        else:
            self.stdout.write(self.style.SUCCESS('Updated demo_hod (Email: hod@demo.local | Password: demo123)'))

        staff_user, created = CustomUser.objects.get_or_create(
            username='demo_staff',
            defaults={'email': 'staff@demo.local', 'role': 'STAFF'}
        )
        staff_user.set_password('demo123')
        staff_user.email = 'staff@demo.local'
        staff_user.role = 'STAFF'
        staff_user.save()
        
        if created:
            self.stdout.write(self.style.SUCCESS('Created demo_staff (Email: staff@demo.local | Password: demo123)'))
        else:
            self.stdout.write(self.style.SUCCESS('Updated demo_staff (Email: staff@demo.local | Password: demo123)'))
        
        self.stdout.write(self.style.SUCCESS('\n=== Demo Users Ready ==='))
        self.stdout.write('HOD User:   Email: hod@demo.local   | Password: demo123')
        self.stdout.write('Staff User: Email: staff@demo.local | Password: demo123')
