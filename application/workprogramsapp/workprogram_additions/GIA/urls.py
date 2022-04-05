from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter

from workprogramsapp.workprogram_additions.GIA.views import GIASet, GIABaseTemplateSet, CriteriaVKRSet

router = DefaultRouter()
router.register(r'api/gia', GIASet, basename='gia')
router.register(r'api/gia_template', GIABaseTemplateSet, basename='gia-template')
router.register(r'api/vkr_criteria', CriteriaVKRSet, basename='vkr-criteria')
urlpatterns  = [

    url(r'^', include(router.urls)),

]