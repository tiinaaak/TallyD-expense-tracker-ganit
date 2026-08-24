from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User

from .models import UserProfile


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):

    if created:
        role = (
            UserProfile.ROLE_ADMIN
            if instance.is_staff
            else UserProfile.ROLE_USER
        )

        UserProfile.objects.create(
            user=instance,
            role=role
        )

    else:
        UserProfile.objects.get_or_create(
            user=instance
        )