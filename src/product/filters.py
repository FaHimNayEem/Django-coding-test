import django_filters
from product.models import *


from .models import Product

class ProductFilter(django_filters.FilterSet):
    title__icontains = django_filters.CharFilter(field_name='title', lookup_expr='icontains')
    min_price = django_filters.NumberFilter(field_name='productvariantprice__price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='productvariantprice__price', lookup_expr='lte')
    created_at = django_filters.DateFromToRangeFilter(field_name='created_at')
    variant__icontains = django_filters.CharFilter(field_name='productvariant__variant_title', lookup_expr='icontains')
    active = django_filters.BooleanFilter(field_name='productvariant__active')
    class Meta:
        model = Product
        fields = []

    @property
    def qs(self):
        queryset = super().qs
        variant_query = self.data.get("variant")

        if variant_query:
            queryset = queryset.filter(
                productvariant__variant_title__icontains=variant_query
            ).distinct()

        return queryset
