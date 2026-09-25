# Güvenlik

İletişim: [guvenlik@rondevu.org](mailto:guvenlik@rondevu.org)

rOndevu olarak sistemlerimizin güvenliğini en yüksek öncelik olarak değerlendiriyoruz. Ancak sistem güvenliğine ne kadar çaba harcarsak harcayalım, güvenlik açıkları hâlâ mevcut olabilir.

Bir güvenlik açığı keşfederseniz, mümkün olan en kısa sürede adım atabilmemiz için bunu bilmek isteriz. Müşterilerimizi ve sistemlerimizi daha iyi korumamıza yardımcı olmanızı rica ediyoruz.

## Kapsam dışı güvenlik açıkları

- Hassas işlem içermeyen sayfalarda tıklama kaçırma (clickjacking).
- Kimlik doğrulamasız/çıkış/giriş CSRF.
- MITM veya kullanıcının cihazına fiziksel erişim gerektiren saldırılar.
- Hizmetimizin kesintiye uğramasına yol açabilecek herhangi bir etkinlik (DoS).
- Saldırı vektörü gösterilmeden / HTML/CSS değiştirilmeden içerik sahtekarlığı ve metin enjeksiyon sorunları.
- E-posta sahtekarlığı
- Eksik DNSSEC, CAA, CSP başlıkları
- Hassas olmayan çerezlerde Secure veya HTTP only bayrağının eksikliği
- Ölü bağlantılar

## Lütfen aşağıdakileri yapın

- Bulgularınızı [guvenlik@rondevu.org](mailto:guvenlik@rondevu.org) adresine e-posta ile gönderin.
- Altyapımızda veya kontrol panelimizde otomatik tarayıcılar çalıştırmayın. Bunu yapmak istiyorsanız, bizimle iletişime geçin ve sizin için bir sandbox kuralım.
- Keşfettiğiniz güvenlik açığından veya sorundan yararlanmayın, örneğin güvenlik açığını göstermek için gerekenden fazla veri indirmek veya başkalarının verilerini silmek veya değiştirmek gibi.
- Sorun çözülene kadar başkalarına açıklamayın.
- Fiziksel güvenlik, sosyal mühendislik, dağıtılmış hizmet reddi, spam veya üçüncü taraf uygulamalarına yönelik saldırılar kullanmayın.
- Sorunu mümkün olan en kısa sürede çözebilmemiz için yeterli bilgi sağlayın.

## Taahhütlerimiz

- Raporunuza 3 iş günü içinde değerlendirmemiz ve beklenen çözüm tarihimizle yanıt vereceğiz.
- Yukarıdaki talimatları takip ettiyseniz, rapora ilişkin size karşı herhangi bir yasal işlem başlatmayacağız.
- Raporunuzu kesinlikle gizli tutacak ve izniniz olmadan kişisel bilgilerinizi üçüncü taraflarla paylaşmayacağız.
- Sorunu çözme sürecindeki ilerleme hakkında sizi bilgilendireceğiz.
- Bildirilen sorunla ilgili kamuya açık bilgilerde, adınızı sorunun keşfedicisi olarak vereceğiz (aksi yönde bir isteğiniz olmadıkça).
- Tüm sorunları mümkün olan en kısa sürede çözmeye çalışıyoruz.
