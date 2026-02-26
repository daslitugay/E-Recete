1. **Üye Olma**
   - **API Metodu:** `POST /auth/register`
   - **Açıklama:** Kullanıcıların yeni hesaplar oluşturarak sisteme kayıt olmasını sağlar. Kişisel bilgilerin toplanmasını ve hesap oluşturma işlemlerini içerir. Kullanıcılar email adresi ve şifre belirleyerek hesap oluşturur.

2. **Profil Görüntüleme**
   - **API Metodu:** `GET /users/{userId}`
   - **Açıklama:** Kullanıcının profil bilgilerini görüntülemesini sağlar. Kullanıcı adı, email, telefon gibi kişisel bilgiler ve hesap durumu gösterilir. Kullanıcılar kendi profil bilgilerini görüntüleyebilir veya yöneticiler diğer kullanıcıların bilgilerini inceleyebilir. Güvenlik için giriş yapmış olmak gerekir.

3. **Profil Güncelleme**
   - **API Metodu:** `PUT /users/{userId}`
   - **Açıklama:** Kullanıcının profil bilgilerini güncellemesini sağlar. Kullanıcılar ad, soyad, email, telefon gibi kişisel bilgilerini değiştirebilir. Güvenlik için giriş yapmış olmak gerekir ve kullanıcılar yalnızca kendi bilgilerini güncelleyebilir.

4. **Hesap Silme**
   - **API Metodu:** `DELETE /users/{userId}`
   - **Açıklama:** Kullanıcının hesabını sistemden kalıcı olarak silmesini sağlar. Kullanıcı hesabını kapatmak istediğinde veya yönetici tarafından hesap kapatılması gerektiğinde kullanılır. Bu işlem geri alınamaz ve kullanıcının tüm verileri silinir. Güvenlik için giriş yapmış olmak gerekir.

5. **Giriş Yapma**
   - **API Metodu:** `POST /auth/login`
   - **Açıklama:** Kullanıcıların yeni hesaplar oluşturarak sisteme kayıt olmasını sağlar. Kişisel bilgilerin toplanmasını ve hesap oluşturma işlemlerini içerir. Kullanıcılar email adresi ve şifre belirleyerek hesap oluşturur.

6. **İlaç Ekleme**
   - **API Metodu:** `POST /medications/add`
   - **Açıklama:** Kullanıcıların evlerinde bulunan ilaçları sisteme ekleyebilmesini sağlar. Kullanıcı ilaç adı, kutu sayısı, kutu içindeki adet bilgisi ve son kullanma tarihi gibi bilgileri girerek ilaçlarını kayıt altına alabilir. Bu sayede kullanıcıların kişisel dijital ilaç dolabı oluşturması sağlanır.

7. **İlaç Bilgilerini Değiştirme**
   - **API Metodu:** `PUT /medications/{medicationsId}`
   - **Açıklama:** Kullanıcıların daha önce sisteme ekledikleri ilaçların bilgilerini güncellemelerini sağlar. İlaç miktarı, adet bilgisi veya son kullanma tarihi gibi bilgiler değiştirilebilir. Bu özellik kullanıcıların ilaç bilgilerini güncel tutmasına yardımcı olur.

8. **İlaç Silme**
   - **API Metodu:** `DELETE /medications/{medicationsId}`
   - **Açıklama:** Kullanıcıların artık kullanmadıkları veya ellerinde bulunmayan ilaçları sistemden kaldırmasını sağlar. Kullanıcı seçtiği ilacı kalıcı olarak silebilir. Bu işlem sonrasında ilgili ilaç bilgisi sistemden tamamen kaldırılır.

9. **İlaç Görüntüleme**
   - **API Metodu:** `GET /medications/{medicationsId}`
   - **Açıklama:** Kullanıcının sisteme eklediği tüm ilaçları görüntülemesini sağlar. Kullanıcı ilaçların adını, miktarını, kutu içindeki adet sayısını ve son kullanma tarihini görüntüleyebilir. Bu özellik kullanıcıların evdeki ilaçlarını kolayca takip etmesine yardımcı olur.

10. **Reçete Ekleme**
   - **API Metodu:** `POST /prescriptions/
   - **Açıklama:** Kullanıcıların doktor tarafından verilen reçeteleri sisteme eklemesini sağlar. Kullanıcı reçetede yer alan ilaçları sisteme kaydederek hangi ilaçları kullanması gerektiğini takip edebilir. Sistem aynı zamanda kullanıcının elindeki ilaçlarla reçetedeki ilaçları karşılaştırabilir.

11. **Reçete Bilgilerini Değiştirme**
   - **API Metodu:** `PUT /prescriptions/{prescriptionsId}`
   - **Açıklama:** Kullanıcıların sisteme ekledikleri reçetelerin bilgilerini güncellemelerini sağlar. Reçetede yer alan ilaçlar veya diğer bilgiler değiştirilebilir. Bu özellik reçete bilgilerinin güncel tutulmasını sağlar.

12. **Reçete Silme**
   - **API Metodu:** `DELETE /prescriptions/{prescriptionsId}`
   - **Açıklama:** Kullanıcıların sistemde kayıtlı olan reçeteleri silmesini sağlar. Artık kullanılmayan veya geçerliliğini yitirmiş reçeteler sistemden kaldırılabilir. Silme işlemi sonrasında reçete bilgileri sistemden kalıcı olarak silinir.

13. **Reçete Görüntüleme**
   - **API Metodu:** `GET /prescriptions/{prescriptionsId}`
   - **Açıklama:** Kullanıcının sisteme eklediği tüm reçeteleri görüntülemesini sağlar. Kullanıcı reçetelerde yer alan ilaçları ve ilgili bilgileri inceleyebilir. Bu özellik kullanıcıların reçetelerini takip etmesini ve gerekli ilaçları kontrol etmesini kolaylaştırır.

