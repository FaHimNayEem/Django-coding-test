from django.views import generic
from config.g_model import TimeStampMixin
from product.models import Variant, Product, ProductVariantPrice, ProductVariant
from rest_framework.filters import SearchFilter, OrderingFilter
from product.filters import ProductFilter 
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django_filters.views import FilterView


class ProductListView(generic.ListView, FilterView):
    template_name = 'products/list.html'
    model=Product
    context_object_name = 'product_list'
    paginate_by=2
    filterset_class = ProductFilter
    
    def get_queryset(self):
        
        user = self.request.user
        product_list = Product.objects.all()
        
        return product_list

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        
        context['search_query'] = self.request.GET.get('q', '')
        context['variant_list'] = ProductVariant.objects.values_list('variant_title', flat=True).distinct()
        page = context.get('page_obj')
        if page is not None:
            start_index = (page.number - 1) * self.paginate_by + 1
            end_index = start_index + len(page.object_list) - 1
        else:
            start_index = 0
            end_index = 0
        context['start_index'] = start_index
        context['end_index'] = end_index
        return context

class CreateProductView(generic.TemplateView):
    template_name = 'products/create.html'

    def get_context_data(self, **kwargs):
        context = super(CreateProductView, self).get_context_data(**kwargs)
        variants = Variant.objects.filter(active=True).values('id', 'title')
        context['product'] = True
        context['variants'] = list(variants.all())
        return context
