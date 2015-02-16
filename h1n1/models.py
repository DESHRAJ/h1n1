from django.db import models
from django.contrib.gis.db import models as gis_models
from django.contrib.gis import geos
# Create your models here.

class Restro(models.Model):
    address = models.CharField(max_length = 1000)
    labId=models.CharField(max_length=100)
    name = models.CharField(max_length=200)
    #comment=models.CharField(max_length=1000)
    # latitude=models.FloatField(default=0.0)
    # longitude=models.FloatField(default=0.0)
    visitDate=models.DateTimeField('visit date generated')
    #restroId=models.CharField(max_length=20)
    location = gis_models.PointField(u"longitude/latitude",geography=True,blank=True,null=True)
    gis = gis_models.GeoManager()
    objects = models.Manager()

    def __unicode__(self):
        return self.address