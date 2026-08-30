from rest_framework import serializers
from django.contrib.auth.models import User
from main.app.models import UserProfile, Skill, Project, Blog, Experience, TerminalCommand, ContactSubmission, SocialLink

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]

class UserProfileSerializer(serializers.ModelSerializer):
    avatar_url = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    favicon_url = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    github_url = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    linkedin_url = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    resume_url = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = UserProfile
        fields = "__all__"
        read_only_fields = ["user"]

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = "__all__"

class ProjectSerializer(serializers.ModelSerializer):
    slug = serializers.CharField(required=False, allow_blank=True)
    long_description = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    image_url = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    github_url = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    demo_url = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    tech_stack_list = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = ["id", "title", "slug", "description", "long_description", "image_url", "github_url", "demo_url", "tech_stack", "tech_stack_list", "order"]

    def get_tech_stack_list(self, obj):
        if obj.tech_stack:
            return [tech.strip() for tech in obj.tech_stack.split(",") if tech.strip()]
        return []

    def validate_slug(self, value):
        from django.utils.text import slugify
        if not value:
            return ""
        return slugify(value)

class BlogSerializer(serializers.ModelSerializer):
    slug = serializers.CharField(required=False, allow_blank=True)
    cover_image_url = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    tags = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    tags_list = serializers.SerializerMethodField()

    class Meta:
        model = Blog
        fields = ["id", "title", "slug", "excerpt", "content", "cover_image_url", "tags", "tags_list", "is_published", "created_at", "updated_at"]

    def get_tags_list(self, obj):
        if obj.tags:
            return [tag.strip() for tag in obj.tags.split(",") if tag.strip()]
        return []

    def validate_slug(self, value):
        from django.utils.text import slugify
        if not value:
            return ""
        return slugify(value)

class ExperienceSerializer(serializers.ModelSerializer):
    description_points = serializers.SerializerMethodField()

    class Meta:
        model = Experience
        fields = ["id", "role", "company", "location", "start_date", "end_date", "is_current", "description", "description_points", "order"]

    def get_description_points(self, obj):
        if obj.description:
            return [point.strip() for point in obj.description.split("\n") if point.strip()]
        return []

class TerminalCommandSerializer(serializers.ModelSerializer):
    class Meta:
        model = TerminalCommand
        fields = ["id", "command", "response", "description", "order"]

class ContactSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSubmission
        fields = ["id", "name", "email", "subject", "message", "created_at"]

class SocialLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLink
        fields = ["id", "platform", "label", "url", "icon", "order", "is_active"]
