Recently, I've found myself running an EC2 instance in a hybrid cloud environment, 
for software where the private and public IP of a machine matter and must remain static.  
This was a lift and shift effort, and we didn't want to lose the 99.9% uptime guaranteed
from running inside of a data center.  While EC2 offers 99.99% uptime, this is only the case
when paired with other tools AWS offers, like EC2 Auto Recovery and AutoScale Groups.  

In our case, we could have created single instances, in multiple availability zones, without
the need of an autoscale group.  The design of this application goes against the design of a
typical AutoScale application, as the IP's, as well as the machine name, are very important.  

So to avoid using an Autoscale group to guarantee HA, we looked at EC2 Auto Recovery as a simple
answer to situations like Hardware, or OS failures within EC2.  

## The problem with EC2 Auto Recovery

Auto Recovery only triggers when AWS detects a hardware failure.  There is no way to simulate this 
type of event, so there is no way to tell if auto recovery works, and if it will bring the instance
back up in the state you want it.

## Getting by with an AutoScale Group

So the next solution was to put our single instance inside of an autoscale group.  The challenge here
is that a Launch Configuration won't accept a network interface as a parameter.  This makes sense, an
autoscale group needs to be able to make n number of instances to match load.  This means it would need
a way to accept an unknown number of network interfaces in order to create a new EC2 instance.  

To get around this, we added a command for cfn-init to attach an Elastic Network Interface (eni) to 
our newly created instance.  This eni is created in a Cloudformation template along with the instance
in the autoscale group.  The template also creates an Elastic IP (eip) and attaches that to the eni.  

To be on the safe side, we dismount the eni from any instance it might be attached to, then attach it.

This means that we now have two interfaces running on the instance.  This can cause other problems if
your software assumes there is only one network interface.  Because we are running on Windows, to work 
around this, we set the interface priority to prioritize our newly attached interface over the default
one that gets attached.  

```ps1
Set-NetIPInterface -InterfaceIndex 2 -InterfaceMetrix 30
```

With that, we can now terminate our instance and watch our autoscale group spin up a new instance,
with it's private/public IP in tact.  
