-- ============================================================
-- SQL Schema gegenereerd op basis van het ERD-diagram
-- Met CHECK, UNIQUE, NOT NULL en FK constraints
-- ============================================================

-- Gebruikers (basis voor student, docent, mentor, admin)
CREATE TABLE user (
    user_id        INT          AUTO_INCREMENT PRIMARY KEY,
    rol            VARCHAR(50)  NOT NULL,
    email          VARCHAR(255) NOT NULL,
    wachtwoord     VARCHAR(255) NOT NULL,
    voornaam       VARCHAR(100) NOT NULL,
    achternaam     VARCHAR(100) NOT NULL,
    telefoonnummer VARCHAR(20)  DEFAULT NULL,

    CONSTRAINT uq_user_email
        UNIQUE (email),

    CONSTRAINT chk_user_rol
        CHECK (rol IN ('student', 'docent', 'mentor', 'admin', 'comitie')),

    CONSTRAINT chk_user_email_format
        CHECK (email LIKE '%@%.%'),

    CONSTRAINT chk_user_telefoonnummer
        CHECK (telefoonnummer IS NULL OR telefoonnummer REGEXP '^[0-9+\\- ]{7,20}$')
);

-- Student
CREATE TABLE student (
    student_id INT PRIMARY KEY,

    CONSTRAINT fk_student_user
        FOREIGN KEY (student_id) REFERENCES user(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- Docent
CREATE TABLE docent (
    docent_id INT PRIMARY KEY,

    CONSTRAINT fk_docent_user
        FOREIGN KEY (docent_id) REFERENCES user(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- Stagecomité
CREATE TABLE comitie (
    stagecomitei_id INT AUTO_INCREMENT PRIMARY KEY
);

-- Mentor
CREATE TABLE mentor (
    mentor_id INT PRIMARY KEY,

    CONSTRAINT fk_mentor_user
        FOREIGN KEY (mentor_id) REFERENCES user(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- Admin
CREATE TABLE admin (
    admin_id INT PRIMARY KEY,

    CONSTRAINT fk_admin_user
        FOREIGN KEY (admin_id) REFERENCES user(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- Bedrijf
CREATE TABLE bedrijf (
    bedrijf_id INT          AUTO_INCREMENT PRIMARY KEY,
    naam       VARCHAR(255) NOT NULL,
    adres      VARCHAR(255) NOT NULL,
    mentor_id  INT          NOT NULL,

    CONSTRAINT uq_bedrijf_naam
        UNIQUE (naam),

    CONSTRAINT chk_bedrijf_naam_niet_leeg
        CHECK (TRIM(naam) <> ''),

    CONSTRAINT fk_bedrijf_mentor
        FOREIGN KEY (mentor_id) REFERENCES mentor(mentor_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Competenties
CREATE TABLE competenties (
    competentie_id INT          AUTO_INCREMENT PRIMARY KEY,
    code           VARCHAR(50)  NOT NULL,
    title          VARCHAR(255) NOT NULL,
    omschrijving   TEXT         NOT NULL,
    gewicht        DECIMAL(5,2) NOT NULL,

    CONSTRAINT uq_competentie_code
        UNIQUE (code),

    CONSTRAINT chk_competentie_gewicht
        CHECK (gewicht > 0 AND gewicht <= 100)
);

-- Stageaanvraag
CREATE TABLE stageaanvraag (
    stageaanvraag_id      INT         AUTO_INCREMENT PRIMARY KEY,
    student_id            INT         NOT NULL,
    docent_id             INT         NOT NULL,
    status                VARCHAR(50) NOT NULL,
    mentor_id             INT         NOT NULL,
    bedrijfs_id           INT         NOT NULL,
    omschrijving_opdracht TEXT        NOT NULL,
    begin_datum           DATE        NOT NULL,
    eind_datum            DATE        NOT NULL,

    CONSTRAINT chk_stageaanvraag_status
        CHECK (status IN ('ingediend', 'goedgekeurd', 'afgekeurd', 'actief', 'afgerond')),

    CONSTRAINT chk_stageaanvraag_datums
        CHECK (eind_datum > begin_datum),

    CONSTRAINT fk_stageaanvraag_student
        FOREIGN KEY (student_id)  REFERENCES student(student_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT fk_stageaanvraag_docent
        FOREIGN KEY (docent_id)   REFERENCES docent(docent_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT fk_stageaanvraag_mentor
        FOREIGN KEY (mentor_id)   REFERENCES mentor(mentor_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT fk_stageaanvraag_bedrijf
        FOREIGN KEY (bedrijfs_id) REFERENCES bedrijf(bedrijf_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Stageovereenkomst (1-op-1 met stageaanvraag)
CREATE TABLE stageovereenkomst (
    stageovereenkomst_id INT          AUTO_INCREMENT PRIMARY KEY,
    stageaanvraag_id     INT          NOT NULL,
    document             LONGBLOB     NOT NULL,
    document_naam        VARCHAR(255) NOT NULL,
    document_mimetype    VARCHAR(100) NOT NULL DEFAULT 'application/pdf',

    CONSTRAINT uq_stageovereenkomst_aanvraag
        UNIQUE (stageaanvraag_id),

    CONSTRAINT chk_stageovereenkomst_mimetype
        CHECK (document_mimetype IN ('application/pdf', 'application/msword',
               'application/vnd.openxmlformats-officedocument.wordprocessingml.document')),

    CONSTRAINT fk_stageovereenkomst_aanvraag
        FOREIGN KEY (stageaanvraag_id) REFERENCES stageaanvraag(stageaanvraag_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- Logboek
CREATE TABLE logboek (
    logboek_id                     INT         AUTO_INCREMENT PRIMARY KEY,
    stageaanvraag_id               INT         NOT NULL,
    beschrijving_uitgevoerde_taken TEXT        NOT NULL,
    datum                          DATE        NOT NULL,
    problemen_leerpunten           TEXT        DEFAULT NULL,
    afgevinkt_door_mentor          BOOLEAN     NOT NULL DEFAULT FALSE,
    reflectie                      TEXT        DEFAULT NULL,
    status                         VARCHAR(50) NOT NULL,

    CONSTRAINT chk_logboek_status
        CHECK (status IN ('concept', 'ingediend', 'goedgekeurd', 'afgekeurd')),

    CONSTRAINT uq_logboek_aanvraag_datum
        UNIQUE (stageaanvraag_id, datum),

    CONSTRAINT fk_logboek_stageaanvraag
        FOREIGN KEY (stageaanvraag_id) REFERENCES stageaanvraag(stageaanvraag_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- Opmerking bij logboek
CREATE TABLE opmerking_logboek (
    opmerking_id INT  AUTO_INCREMENT PRIMARY KEY,
    logboek_id   INT  NOT NULL,
    opmerking    TEXT NOT NULL,

    CONSTRAINT chk_opmerking_niet_leeg
        CHECK (TRIM(opmerking) <> ''),

    CONSTRAINT fk_opmerking_logboek
        FOREIGN KEY (logboek_id) REFERENCES logboek(logboek_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- Evaluatie
CREATE TABLE evaluatie (
    evaluatie_id      INT          AUTO_INCREMENT PRIMARY KEY,
    type_evaluatie    VARCHAR(100) NOT NULL,
    stageaanvraag_id  INT          NOT NULL,
    competentie_id    INT          NOT NULL,
    final_score       DECIMAL(5,2) DEFAULT NULL,
    final_feedback    TEXT         DEFAULT NULL,
    feedback          TEXT         DEFAULT NULL,
    score_student     DECIMAL(5,2) DEFAULT NULL,
    feedback_student  TEXT         DEFAULT NULL,
    score_mentor      DECIMAL(5,2) DEFAULT NULL,
    feedback_mentor   TEXT         DEFAULT NULL,

    CONSTRAINT chk_evaluatie_type
        CHECK (type_evaluatie IN ('tussentijds', 'eind', 'zelf')),

    CONSTRAINT chk_evaluatie_final_score
        CHECK (final_score IS NULL OR (final_score >= 0 AND final_score <= 20)),

    CONSTRAINT chk_evaluatie_score_student
        CHECK (score_student IS NULL OR (score_student >= 0 AND score_student <= 20)),

    CONSTRAINT chk_evaluatie_score_mentor
        CHECK (score_mentor IS NULL OR (score_mentor >= 0 AND score_mentor <= 20)),

    CONSTRAINT uq_evaluatie_aanvraag_competentie_type
        UNIQUE (stageaanvraag_id, competentie_id, type_evaluatie),

    CONSTRAINT fk_evaluatie_stageaanvraag
        FOREIGN KEY (stageaanvraag_id) REFERENCES stageaanvraag(stageaanvraag_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT fk_evaluatie_competentie
        FOREIGN KEY (competentie_id) REFERENCES competenties(competentie_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);