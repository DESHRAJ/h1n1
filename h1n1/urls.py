from django.conf.urls import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls import patterns, include, url
from django.views.generic import RedirectView
from django.views.generic import TemplateView
from django.core.urlresolvers import reverse
from django.contrib.auth.views import login, logout
from django.contrib.auth.models import User
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
	# Examples:
	url(r'^$', 'h1n1.views.home', name='home'),
	url(r'^admin/', include(admin.site.urls)),
	url(r'login', 'h1n1.views.login', name='login'),
	url(r'register', 'h1n1.views.signup', name='signup'),
	url(r'logout', 'django.contrib.auth.views.logout',{'next_page': '/login'}),
	url(r'dashboard', 'h1n1.views.dashboard', name='dashboard'),
	url(r'uploadreport', 'h1n1.views.upload', name='upload'),
	url(r'savelocation', 'h1n1.views.savelocation', name='savelocation'),
)

urlpatterns += patterns('',
    (r'^static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.STATIC_ROOT}),
)