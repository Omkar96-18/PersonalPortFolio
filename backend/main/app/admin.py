from django.contrib import admin
from main.app.models import UserProfile, Skill, Project, Blog, Experience

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ["name", "title", "email", "location"]
    search_fields = ["name", "title", "bio"]

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ["name", "category", "proficiency", "order"]
    list_filter = ["category", "proficiency"]
    search_fields = ["name"]
    ordering = ["category", "order", "name"]

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ["title", "slug", "tech_stack", "order"]
    search_fields = ["title", "description", "tech_stack"]
    prepopulated_fields = {"slug": ("title",)}
    ordering = ["order", "-id"]

@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display = ["title", "slug", "is_published", "created_at", "updated_at"]
    list_filter = ["is_published", "created_at", "updated_at"]
    search_fields = ["title", "excerpt", "content", "tags"]
    prepopulated_fields = {"slug": ("title",)}
    ordering = ["-created_at"]

@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ["role", "company", "start_date", "end_date", "is_current", "order"]
    list_filter = ["is_current", "start_date"]
    search_fields = ["role", "company", "description"]
    ordering = ["order", "-start_date"]
