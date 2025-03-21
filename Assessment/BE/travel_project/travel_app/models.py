from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.timezone import now



class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('user', 'User'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')

    def __str__(self):
        return self.username


class TravelRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE,null=True, blank=True)
    from_place = models.CharField(max_length=255) 
    to_place = models.CharField(max_length=255) 
    reason = models.TextField()
    start_date = models.DateField(null=True, blank=True)  
    end_date = models.DateField(null=True, blank=True)
    applied_at = models.DateTimeField(default=now) 
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"{self.user.username} - {self.from_place} to {self.to_place}"