import urllib.parse
from typing import Dict, Any
from app.core.config import settings

class NotificationService:
    @staticmethod
    def generate_whatsapp_lead_link(booking_data: Dict[str, Any]) -> str:
        """
        Generate instant WhatsApp message link to notify the Roarworks team or for visitor direct contact.
        """
        name = booking_data.get("full_name", "Visitor")
        plan = booking_data.get("plan_interest", "Coworking Space")
        btype = booking_data.get("booking_type", "Personal")
        start = booking_data.get("start_date", "Soon")
        email = booking_data.get("email", "")
        phone = booking_data.get("phone", "N/A")

        message = (
            f"Hello The Roarworks Team!\n\n"
            f"New Tour Booking Request:\n"
            f"• Name: {name}\n"
            f"• Email: {email}\n"
            f"• Phone: {phone}\n"
            f"• Plan Interest: {plan}\n"
            f"• Booking Type: {btype}\n"
            f"• Date: {start}\n\n"
            f"Please confirm available slots at Blue Area, Islamabad."
        )

        encoded_text = urllib.parse.quote(message)
        clean_number = settings.WHATSAPP_NUMBER.replace("+", "").replace(" ", "").replace("-", "")
        return f"https://wa.me/{clean_number}?text={encoded_text}"

    @staticmethod
    async def dispatch_new_booking_alert(booking_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Simulate instant team alert dispatch (Email + WhatsApp Webhook).
        """
        wa_link = NotificationService.generate_whatsapp_lead_link(booking_data)
        alert_payload = {
            "channel": "email_and_whatsapp",
            "team_recipient": settings.ADMIN_EMAIL,
            "subject": f"New Tour Booking: {booking_data.get('full_name')} for {booking_data.get('plan_interest')}",
            "whatsapp_link": wa_link,
            "status": "delivered_to_team",
            "location": settings.LOCATION_NAME
        }
        return alert_payload
