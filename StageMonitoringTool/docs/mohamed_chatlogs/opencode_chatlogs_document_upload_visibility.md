# Chatlog: Document upload visibility issue

**Sessie:** ses_1333b87b4ffeV83RJzT5AWhi1R
**Datum:** 15 juni 2026
**Onderwerp:** Admin kan document niet zien na student sendback

---

### Gebruiker

It still is not fixed, the admin cannot see that user that sent the document back to validate it in the document section. when the student sends the document sent by the admin back to the admin, the admin cannot see it in the documenten section to validate it, it doesn't appear. Is it because of the document geupload status ? Help me fix

### Assistent

Let me read the key files to see the exact current state of the code.

*[Leest bestanden: adminDocumenten.js, stageController.js, stageDocument.js, server.js, documenten.js]*

Let me read more of the server to understand the document routes and also the student-side document upload.

Let me check the document model and the full documents endpoint.

Now let me check the stage model and the admin-upload endpoint more carefully.

Let me check the associations and the admin page to understand the full flow.

**Analyse:**

The issue seems te zijn in de document flow:

1. Admin uploadt een template document → `type: 'admin_template'`, status blijft `GOEDGEKEURD`
2. Student vult het in en uploadt het terug → `type: 'student_submission'`, status wijzigt naar `DOCUMENTGEUPLOADED`
3. Admin zou het moeten zien in "Ontvangen" sectie

De admin pagina (`adminDocumenten.js`) laadt:
1. Haalt stages op met `status IN ('GOEDGEKEURD', 'DOCUMENTGEUPLOADED')` → Dit zou de stage moeten bevatten
2. Voor elke stage, haalt documenten op → Zou zowel admin_template als student_submission moeten retourneren

Het probleem lijkt te liggen in de status mapping of de filtering van documenten op de admin pagina.

### Gebruiker

It still is not fixed, the admin cannot see that user that sent the document back to validate it in the document section. when the student sends the document sent by the admin back to the admin, the admin cannot see it in the documenten section to validate it, it doesn't appear. Is it because of the document geupload status ? Help me fix

### Gebruiker

It still is not fixed, the admin cannot see that user that sent the document back to validate it in the document section. when the student sends the document sent by the admin back to the admin, the admin cannot see it in the documenten section to validate it, it doesn't appear. Is it because of the document geupload status ? Help me fix

### Assistent

Let me analyze the bug more carefully. The user is saying that when a student sends a document back (uploads a student_submission), the admin cannot see it in the "documenten" section to validate it.

**Volledige flow analyse:**

1. Admin uploadt een template document (`admin_template`) → status blijft `GOEDGEKEURD`
2. Student uploadt ingevuld document (`student_submission`) → status wijzigt naar `DOCUMENTGEUPLOADED`
3. Admin pagina zou stages moeten tonen met `status IN ('GOEDGEKEURD', 'DOCUMENTGEUPLOADED')`
4. Voor elke stage worden documenten opgehaald en gecategoriseerd op validatie status en document types

Het probleem is waarschijnlijk dat de admin pagina niet correct filtert op de `DOCUMENTGEUPLOADED` status of dat de document categorisatie niet klopt wanneer een student een document terugstuurt voor validatie.
