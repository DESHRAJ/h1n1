from django.core.context_processors import csrf
from django.template import Context,RequestContext
from django.shortcuts import render_to_response, render,redirect
from django.http import *
from django.conf import settings
from django.contrib.gis import geos
from django.contrib import auth
from django.contrib.auth.models import User
from django.contrib.auth import logout
from django.core.mail import send_mail
from django.template.loader import render_to_string, get_template
from django.core.mail import EmailMultiAlternatives
from datetime import datetime,timedelta
from h1n1.models import *

import random,string,ast

def home(request):
	""" 
	Home page view of the django application
	"""
	return render_to_response('index.html')


def signup(request):
	"""
	signup for the user 
	"""
	if not request.user.is_active:
		if request.POST:
			print "entered the if sectison"
			username = request.POST['username']
			email = request.POST['email']
			password = request.POST['password']
			firstname = request.POST['firstname']
			lastname = request.POST['lastname']
			try:
				user = User.objects.create_user(username=username,email=email,password=password,first_name=firstname,last_name=lastname)
				user.save()
				return HttpResponseRedirect("/profile")
			except:
				return HttpResponse("This Id already exists")
		else:
			print "entered the else section"
			return render_to_response("register.html",context_instance=RequestContext(request))
	else:
		return HttpResponseRedirect("/")	

def login(request):
	""" 
	Login view
	"""
	if not request.user.is_authenticated():
		if request.POST:
			username = request.POST['username']
			password = request.POST['password']
			user = auth.authenticate(username=username, password=password)
			if user is not None and user.is_active:
				auth.login(request,user)
				return HttpResponseRedirect("/dashboard")
			else:
				return render_to_response('login.html',{'incorrect':1},context_instance=RequestContext(request))				
		return render_to_response('login.html',context_instance=RequestContext(request))
	else:
		return HttpResponseRedirect("/dashboard")

# 	logout(request)
# 	# return HttpResponseRedirect("/")
# 	return render_to_response("index.html",{'logout':1},context_instance=RequestContext(request))

def dashboard(request):
	""" 
	View for the PathLabs to see the data uploaded by them and also an option to update the data they 
	have provided to the government
	"""
	c = {}
	c.update(csrf(request))
	all_patients=PatientData.objects.filter(labId='1')
	return render_to_response('mdashboard.html',{'all_patients':all_patients},context_instance=RequestContext(request))

def upload(request):
	"""
	For uploading the patient data 
	"""
	c = {}
	c.update(csrf(request))
	return render_to_response('upload.html', context_instance=RequestContext(request))

def savelocation(request):
	"""
	View for saving the location of the Patient
	"""
	c = {}
	c.update(csrf(request))
	if request.POST:
		print 'post request'
		name=request.POST['name']
		address=request.POST['address']
		latitude=request.POST['latitude']
		longitude=request.POST['longitude']
		print name,address,latitude,longitude
		point = "POINT(%s %s)" % (longitude, latitude)
		location = geos.fromstr(point)
		newpatient=PatientData(address=address,name=name,location=location,labId='1')
		newpatient.save()
		print 'patient details saved'
		return HttpResponseRedirect('/dashboard')
	return render_to_response('upload.html', context_instance=RequestContext(request))

def showdata(request):
	""" 
	Loads the data on Maps 
	"""
	patients=PatientData.objects.all()
	return render_to_response('distribution.html',{'patients':patients},context_instance=RequestContext(request))
