# Portfolio Website - Contact Form Setup

Bu web sitesindeki contact form artık tamamen işlevsel! EmailJS kullanarak doğrudan frontend'den email gönderebilirsiniz.

## EmailJS Kurulumu

EmailJS'i aktif hale getirmek için aşağıdaki adımları takip edin:

### 1. EmailJS Hesabı Oluşturma
1. [EmailJS](https://www.emailjs.com/) sitesine gidin
2. Ücretsiz hesap oluşturun
3. Dashboard'a giriş yapın

### 2. Email Service Ekleme
1. "Email Services" sekmesine gidin
2. "Add New Service" butonuna tıklayın
3. Email sağlayıcınızı seçin (Gmail, Outlook, etc.)
4. Service ID'nizi kopyalayın

### 3. Email Template Oluşturma
1. "Email Templates" sekmesine gidin
2. "Create New Template" butonuna tıklayın
3. Şu template'i kullanın:

```
Subject: {{from_name}} adlı kişiden yeni mesaj

Merhaba {{to_name}},

{{from_name}} ({{from_email}}) adlı kişi portfolio sitenizden mesaj gönderdi:

{{message}}

İyi çalışmalar!
```

4. Template ID'nizi kopyalayın

### 4. Public Key Alma
1. "Account" sekmesine gidin
2. Public Key'inizi kopyalayın

### 5. Environment Variables Güncelleme
`.env.local` dosyasındaki değerleri güncelleyin:

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_actual_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_actual_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_actual_public_key
```

### 6. Sunucuyu Yeniden Başlatma
```bash
pnpm dev
```

## Özellikler

✅ **Responsive Form**: Tüm cihazlarda mükemmel görünüm
✅ **Validation**: Form doğrulama ve hata kontrolü
✅ **Loading States**: Gönderim sırasında loading göstergesi
✅ **Success/Error Messages**: Kullanıcı geri bildirimi
✅ **Form Reset**: Başarılı gönderim sonrası form temizleme
✅ **Environment Variables**: Güvenli konfigürasyon

## Alternative Çözümler

Eğer EmailJS kullanmak istemezseniz, diğer seçenekler:

1. **Formspree**: Basit form handling servisi
2. **Netlify Forms**: Netlify'da host ediyorsanız
3. **Next.js API Routes**: Kendi backend endpoint'iniz
4. **Nodemailer**: Daha gelişmiş email çözümü

## Teknik Detaylar

- **EmailJS**: Frontend'den doğrudan email gönderme
- **React State Management**: Form state'i ve validation
- **TypeScript**: Type safety
- **Tailwind CSS**: Responsive styling
- **Error Handling**: Comprehensive error management

Form artık tamamen hazır ve çalışır durumda! 🚀
