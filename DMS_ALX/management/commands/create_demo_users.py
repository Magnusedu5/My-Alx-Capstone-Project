from django.core.management.base import BaseCommand
from DMS_ALX.models import CustomUser


class Command(BaseCommand):
    help = 'Create demo HOD and Staff users (non-interactive)'

    def handle(self, *args, **options):
        if not CustomUser.objects.filter(username='demo_hod').exists():
            CustomUser.objects.create_user(username='demo_hod', email='hod@demo.local', password='hodpass', role='HOD')
            self.stdout.write(self.style.SUCCESS('Created demo_hod (password: hodpass)'))
        else:
            self.stdout.write('demo_hod already exists')

        if not CustomUser.objects.filter(username='demo_staff').exists():
            CustomUser.objects.create_user(username='demo_staff', email='staff@demo.local', password='staffpass', role='STAFF')
            self.stdout.write(self.style.SUCCESS('Created demo_staff (password: staffpass)'))
        else:
            self.stdout.write('demo_staff already exists')
