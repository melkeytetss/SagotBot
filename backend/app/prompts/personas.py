"""Pre-built industry templates for Philippine SMEs."""

from typing import Any, Dict


PERSONA_PRESETS: Dict[str, Dict[str, Any]] = {
    "dental": {
        "business_name": "Smiles Dental Clinic",
        "business_type": "Dental Clinic",
        "location": "Unit 304, Bonifacio Stopover, BGC, Taguig City",
        "hours": "Monday to Saturday from 9:00 AM to 6:00 PM. Closed on Sundays.",
        "services": [
            "Oral Prophylaxis (Dental Cleaning) - ₱1,500 to ₱2,500",
            "Tooth Extraction (Bunot) - Starts at ₱1,200 per tooth",
            "Dental Fillings (Pasta/Composite) - Starts at ₱1,000 per surface",
            "Teeth Whitening - ₱12,000 package",
            "Braces / Orthodontic Consultation - ₱800 consultation fee",
        ],
        "faqs": [
            {"q": "Tumatanggap po ba kayo ng HMO / Health Card?", "a": "Opo, accredited po kami sa Maxicare, Intellicare, Medicard, at PhilCare. Pakidala lamang po ang inyong HMO card at valid ID."},
            {"q": "Pwede po ba walk-in?", "a": "Tumatanggap po kami ng walk-ins subject to availability, pero mas inirerekomenda po ang booking para iwas hintay."},
            {"q": "May parking po ba?", "a": "Opo, may basement parking po sa Stopover building."},
            {"q": "Magkano po bunot ng wisdom tooth?", "a": "Depende po sa xray, karaniwan ₱8,000 to ₱15,000 po per tooth para sa impacted wisdom tooth."},
        ],
    },
    "salon": {
        "business_name": "Glow & Glam Beauty Lounge",
        "business_type": "Hair & Beauty Salon",
        "location": "Ground Floor, Ayala Malls the 30th, Pasig City",
        "hours": "Daily 10:00 AM to 9:00 PM (Following Mall Hours).",
        "services": [
            "Signature Haircut & Blowdry - ₱550",
            "Balayage / Hair Color - Starts at ₱3,500",
            "Keratin Treatment / Rebond - Starts at ₱4,000",
            "Gel Manicure & Pedicure - ₱1,200",
            "Eyelash Extensions - Starts at ₱1,800",
        ],
        "faqs": [
            {"q": "Kailangan po ba ng reservation para sa rebond or color?", "a": "Opo, dahil matagal po ang treatment (3-4 oras), mainam po magpa-reserve."},
            {"q": "May promo po ba kayo ngayon?", "a": "Meron po kaming weekday 15% off sa Haircut + Treatment package from 10am to 2pm."},
            {"q": "Pwede po ba magdala ng bata?", "a": "Opo, welcome po ang kids, may kid-friendly haircut station din po kami."},
        ],
    },
    "restaurant": {
        "business_name": "Lutong Bahay Bistro",
        "business_type": "Filipino Restaurant",
        "location": "Timog Avenue, Quezon City",
        "hours": "Tuesday to Sunday from 11:00 AM to 10:00 PM. Closed on Mondays.",
        "services": [
            "Table Reservation (Dine-in)",
            "Advance Takeout / Pick-up Orders",
            "Party Tray Catering Inquiries",
        ],
        "faqs": [
            {"q": "May parking space po ba?", "a": "Opo, may dedicated customer parking po kami sa harap at likod ng restaurant."},
            {"q": "Pwede po ba magdala ng cake? May corkage ba?", "a": "Pwedeng magdala ng birthday cake nang walang corkage fee."},
            {"q": "Pet friendly po ba kayo?", "a": "Opo, pet-friendly po ang aming al fresco outdoor dining area."},
        ],
    },
}


def get_persona_config(business_type: str = "dental") -> Dict[str, Any]:
    """Retrieve default persona configuration for a business category."""
    return PERSONA_PRESETS.get(business_type.lower(), PERSONA_PRESETS["dental"])
