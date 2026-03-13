
import { AnyRequest, ServiceType, MessRequest, KRPRequest, MaintenanceRequest } from '../../types';

const FONNTE_TOKEN = 'VITE_FONNTE_TOKEN';
const FONNTE_TARGET = 'VITE_FONNTE_TARGET'; // Can be a phone number or group ID

export const sendWhatsAppNotification = async (request: AnyRequest) => {
  const token = import.meta.env.VITE_FONNTE_TOKEN;
  const target = import.meta.env.VITE_FONNTE_TARGET;

  if (!token || !target) {
    console.warn('WhatsApp notification skipped: Fonnte token or target not configured.');
    return;
  }

  const message = formatRequestMessage(request);

  try {
    const response = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        'Authorization': token,
      },
      body: new URLSearchParams({
        target: target,
        message: message,
        countryCode: '62', // Indonesia
      }),
    });

    const result = await response.json();
    if (!result.status) {
      console.error('Fonnte API Error:', result.reason);
    } else {
      console.log('WhatsApp notification sent successfully');
    }
  } catch (error) {
    console.error('Failed to send WhatsApp notification:', error);
  }
};

const formatRequestMessage = (req: AnyRequest): string => {
  let details = '';

  if (req.type === ServiceType.MESS) {
    const m = req as MessRequest;
    details = `
📍 Lokasi: ${m.location}
👤 Tamu: ${m.guestName}
📞 HP Tamu: ${m.guestPhone}
🏨 Kamar: ${m.roomCount}
🏢 Fungsi: ${m.function}
👤 Pemesan: ${m.requesterName}
📅 Check-in: ${m.checkInDate}
📅 Check-out: ${m.checkOutDate}`;
  } else if (req.type === ServiceType.KRP) {
    const k = req as KRPRequest;
    details = `
👤 Penumpang: ${k.passengerName}
📞 HP: ${k.passengerPhone}
👥 Jml Orang: ${k.passengerCount}
🏢 Fungsi: ${k.function}
📅 Pergi: ${k.departureDate} ${k.departureTime}
🔄 PP: ${k.isRoundTrip ? 'Ya' : 'Tidak'}${k.isRoundTrip ? `\n📅 Pulang: ${k.returnDate} ${k.returnTime}` : ''}`;
  } else if (req.type === ServiceType.MAINTENANCE) {
    const mt = req as MaintenanceRequest;
    details = `
🛠 Kategori: ${mt.category}
👤 Pemesan: ${mt.requesterName}
📞 HP: ${mt.requesterPhone}
🏢 Fungsi: ${mt.function}
📅 Tgl Kerja: ${mt.workDate}
📝 Detail: ${mt.detail}`;
  }

  return `*🔔 NOTIFIKASI REQUEST BARU*
--------------------------------
📦 Tipe: ${req.type.toUpperCase()}
${details}
--------------------------------
_Mohon segera diproses melalui portal._`;
};
