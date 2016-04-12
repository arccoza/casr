---
title: About & Contact
date: 2016-02-28T16:58:00+09:00
author: Adrien
layout: page.jade
telephone:
  main: +2761 463 3848
  alt: +2761 463 3138
  emergency: +2776 553 8955
email: bookings@casr.co.za
---

## Where are we?

Situated 3 kilometres North of Christiana Town on the N12 towards Bloemhof.

<section class='map'>
<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112850.62880403693!2d25.083786517516344!3d-27.884103366384196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e9a3b33b647f4d5%3A0x11f061ecd4387fa7!2sChristiana%2C+South+Africa!5e0!3m2!1sen!2sjp!4v1460382353704" width="100%" height="100%" frameborder="0" style="border:0" allowfullscreen></iframe>
</section>

## Contact us.

<a href="tel:{{telephone.main}}">{{telephone.main}}</a> or <a href="tel:{{telephone.alt}}">{{telephone.alt}}</a>

### Emergency
<a href="tel:{{telephone.emergency}}">{{telephone.emergency}}</a>

Send us a message below:

<section>
	<form id="contact">
		<label for="subject">Subject:</label><br>
		<input name="subject" type="text"><br>
		<label for="name">Name:</label><br>
		<input name="name" type="text"><br>
		<label for="email" required>email:</label><br>
		<input name="email" type="email" required><br>
		<label for="message" required>Message:</label><br>
		<textarea name="message" required rows="15" placeholder="Write your message here."></textarea><br>
		<input name="send" type="submit" value="Send">
		<label id="sent" style="display: none;">Message sent, thanks, I'll get back to you.</label>
	</form>
</section>
