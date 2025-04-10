import React, { useCallback } from "react";
import styles from "../styles/Vacancies.module.css";

interface Vacancy {
    id: number;
    title: string;
    requirements: string;
    responsibilities: string;
    conditions: string;
    phone: string;
}

const CONTACT_PHONE = "+7 904 271 35 90";

const SECTION_TITLES = {
    REQUIREMENTS: "Требования",
    RESPONSIBILITIES: "Обязанности",
    CONDITIONS: "Условия",
    CONTACT: "Звоните",
} as const;

const vacanciesData: Vacancy[] = [
    {
        id: 1,
        title: "Должность",
        requirements:
            "Текст про требования текст про требования текст про требования текст про требования текст про требования",
        responsibilities:
            "Текст про обязанности текст про обязанности текст про обязанности текст про обязанности текст про обязанности",
        conditions:
            "Текст про условия текст про условия текст про условия текст про условия текст про условия текст про условия",
        phone: CONTACT_PHONE,
    },
    {
        id: 2,
        title: "Должность",
        requirements: "Текст про требования...",
        responsibilities: "Текст про обязанности...",
        conditions: "Текст про условия...",
        phone: CONTACT_PHONE,
    },
    {
        id: 3,
        title: "Должность",
        requirements: "Текст про требования...",
        responsibilities: "Текст про обязанности...",
        conditions: "Текст про условия...",
        phone: CONTACT_PHONE,
    },
    {
        id: 4,
        title: "Должность",
        requirements: "Текст про требования...",
        responsibilities: "Текст про обязанности...",
        conditions: "Текст про условия...",
        phone: CONTACT_PHONE,
    },
    {
        id: 5,
        title: "Должность",
        requirements: "Текст про требования...",
        responsibilities: "Текст про обязанности...",
        conditions: "Текст про условия...",
        phone: CONTACT_PHONE,
    },
    {
        id: 6,
        title: "Должность",
        requirements: "Текст про требования...",
        responsibilities: "Текст про обязанности...",
        conditions: "Текст про условия...",
        phone: CONTACT_PHONE,
    },
];

const Vacancies: React.FC = () => {
    const renderVacancyCard = useCallback((vacancy: Vacancy) => (
        <div key={vacancy.id} className={styles.card}>
            <h2 className={styles.cardTitle}>{vacancy.title}</h2>
            <div className={styles.cardContent}>
                <section>
                    <h3 className={styles.sectionTitle}>{SECTION_TITLES.REQUIREMENTS}</h3>
                    <p>{vacancy.requirements}</p>
                </section>
                <section>
                    <h3 className={styles.sectionTitle}>{SECTION_TITLES.RESPONSIBILITIES}</h3>
                    <p>{vacancy.responsibilities}</p>
                </section>
                <section>
                    <h3 className={styles.sectionTitle}>{SECTION_TITLES.CONDITIONS}</h3>
                    <p>{vacancy.conditions}</p>
                </section>
                <section>
                    <h3 className={styles.phoneLabel}>{SECTION_TITLES.CONTACT}</h3>
                    <a href={`tel:${vacancy.phone}`} className={styles.phoneNumber}>
                        {vacancy.phone}
                    </a>
                </section>
            </div>
        </div>
    ), []);

    return (
        <div className={styles.mainContainer}>
            <div className={styles.vacanciesContainer}>
                <h1 className={styles.title}>Вакансии</h1>
                <div className={styles.cardsContainer}>
                    {vacanciesData.map(renderVacancyCard)}
                </div>
            </div>
        </div>
    );
};

export default Vacancies;
