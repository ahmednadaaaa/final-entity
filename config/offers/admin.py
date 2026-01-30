from django.contrib import admin
from .models import Offer, OfferProduct

class OfferProductInline(admin.TabularInline):
    model = OfferProduct
    extra = 1

@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    list_display = ('title', 'offer_type', 'discount_value', 'start_date', 'end_date', 'is_active', 'is_featured')
    list_filter = ('offer_type', 'is_active', 'is_featured', 'start_date', 'end_date')
    search_fields = ('title', 'description')
    date_hierarchy = 'start_date'
    inlines = [OfferProductInline]
    
    fieldsets = (
        ('معلومات العرض', {
            'fields': ('title', 'description', 'offer_type', 'discount_value')
        }),
        ('الفترة الزمنية', {
            'fields': ('start_date', 'end_date')
        }),
        ('الإعدادات', {
            'fields': ('is_active', 'is_featured', 'badge_text', 'badge_color')
        }),
    )