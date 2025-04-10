import React, { useState, useEffect, useCallback } from "react";
import style from "../styles/Contacts.module.css";
import { useForm } from "react-hook-form";
import { useLocalStorage } from "../utils/storageUtils";
import MapComponent from "./MapComponent";

const SUCCESS_MESSAGE_DURATION = 3000;
const PHONE_PATTERN = /^\+?[0-9]{10,12}$/;
const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  message: string;
}

interface Store {
  name: string;
  address: string;
  phone: string;
}

const STORES: Store[] = [
  {
    name: "ВОСХОД",
    address: "ул. Дорожная 10",
    phone: "+7 904 271 35 90",
  },
  {
    name: "ПАРУС",
    address: "ул. Советская 87",
    phone: "+7 82140 91330",
  },
  {
    name: "РЯБИНУШКА",
    address: "ул. Заводская 16",
    phone: "+7 82140 91101",
  },
  {
    name: "ПЕЛЫСЬ",
    address: "ул. Рабочая 1",
    phone: "+7 82140 91300",
  },
];

const LOCATIONS = ["п.Щельяюр", "д.Вертеп", "с.Краснобор", "д.Диюр"];

const initialFormData: FormData = {
  fullName: "",
  phone: "",
  email: "",
  message: "",
};

const Contacts: React.FC = () => {
  const [formData, setFormData] = useLocalStorage<FormData>(
    "contactFormData",
    initialFormData
  );
  const [submitted, setSubmitted] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: formData,
  });

  useEffect(() => {
    Object.entries(formData).forEach(([key, value]) => {
      setValue(key as keyof FormData, value);
    });
  }, [setValue, formData]);

  const onSubmit = useCallback(
    (data: FormData) => {
      console.log(data);
      setFormData(data);
      setSubmitted(true);
      reset();
      setTimeout(() => setSubmitted(false), SUCCESS_MESSAGE_DURATION);
    },
    [reset, setFormData]
  );

  const handleLocationClick = useCallback((location: string) => {
    setSelectedLocation(location);
    setSelectedStore(null);
  }, []);

  const handleStoreClick = useCallback((store: Store) => {
    setSelectedStore(store);
  }, []);

  const renderStore = useCallback(
    (store: Store) => (
      <div
        key={store.name}
        className={`${style.store} ${
          selectedStore?.name === store.name ? style.active : ""
        }`}
        onClick={() => handleStoreClick(store)}
      >
        <h3 className={style.storeTitle}>{store.name}</h3>
        <p>{store.address}</p>
        <a href={`tel:${store.phone}`}>{store.phone}</a>
      </div>
    ),
    [selectedStore, handleStoreClick]
  );

  return (
    <div className={style.contactsWrapper}>
      <h1 className={style.title}>Контакты</h1>
      <div className={style.contactInfo}>
        <div className={style.contactBlock}>
          <span>📄 Бухгалтерия, склад</span>
          <a href="tel:+78214092619">+7 82140 92619</a>
        </div>
        <div className={style.contactBlock}>
          <span>❓ Вопросы по системе лояльности</span>
          <a href="tel:+79087163397">+7 908 716 33 97</a>
        </div>
      </div>
      <div className={style.message}>
        Группа компаний «СЕВЕРЯНОЧКА» рассматривает социальную ответственность
        как необходимое условие развития своего бизнеса. Заполняйте форму, если
        вам стали известны факты коррупции, конфликта интересов, нарушения
        закупочных процедур, нарушения антимонопольного законодательства,
        злоупотребления должностными полномочиями, дискриминации, нарушения норм
        отраслевого законодательства, норм саморегулирования, нарушения
        Корпоративного кодекса и политик Компании
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className={style.contactForm}>
        <div className={style.formGroup}>
          <input
            {...register("fullName", { required: "Это поле обязательно" })}
            placeholder="Ваше имя"
            className={errors.fullName ? style.error : ""}
            aria-invalid={errors.fullName ? "true" : "false"}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
          />
          {errors.fullName && (
            <span id="fullName-error" className={style.errorMessage}>
              {errors.fullName.message}
            </span>
          )}
        </div>

        <div className={style.formGroup}>
          <input
            {...register("phone", {
              required: "Это поле обязательно",
              pattern: {
                value: PHONE_PATTERN,
                message: "Некорректный номер телефона",
              },
            })}
            placeholder="Номер телефона"
            className={errors.phone ? style.error : ""}
            aria-invalid={errors.phone ? "true" : "false"}
            aria-describedby={errors.phone ? "phone-error" : undefined}
          />
          {errors.phone && (
            <span id="phone-error" className={style.errorMessage}>
              {errors.phone.message}
            </span>
          )}
        </div>

        <div className={style.formGroup}>
          <input
            {...register("email", {
              pattern: {
                value: EMAIL_PATTERN,
                message: "Некорректный email",
              },
            })}
            placeholder="Email"
            className={errors.email ? style.error : ""}
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <span id="email-error" className={style.errorMessage}>
              {errors.email.message}
            </span>
          )}
        </div>

        <div className={style.formGroup}>
          <textarea
            {...register("message")}
            placeholder="Ваше сообщение"
            className={style.messageInput}
            aria-label="Сообщение"
          />
        </div>

        <button type="submit" className={style.submitButton}>
          Отправить
        </button>

        {submitted && (
          <div className={style.successMessage} role="alert">
            Обращение отправлено
          </div>
        )}
      </form>
    </div>
  );
};

export default Contacts;
