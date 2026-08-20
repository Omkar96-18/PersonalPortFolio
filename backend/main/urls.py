"""
URL configuration for main project.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token
from main.app import views

router = routers.DefaultRouter()
router.register(r"profiles", views.UserProfileViewSet, basename="profile")
router.register(r"skills", views.SkillViewSet, basename="skill")
router.register(r"projects", views.ProjectViewSet, basename="project")
router.register(r"blogs", views.BlogViewSet, basename="blog")
router.register(r"experiences", views.ExperienceViewSet, basename="experience")
router.register(r"terminal-commands", views.TerminalCommandViewSet, basename="terminal-command")
router.register(r"messages", views.ContactSubmissionViewSet, basename="contact-submission")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    path("api/contact/", views.ContactSubmissionView.as_view(), name="contact-submit"),
    path("api/upload-resume/", views.ResumeUploadView.as_view(), name="upload-resume"),
    path("api/token-auth/", obtain_auth_token, name="token-auth"),
    path("api/me/", views.CurrentUserView.as_view(), name="current-user"),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
