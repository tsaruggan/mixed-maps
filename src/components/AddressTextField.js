import styles from "@/styles/Home.module.css";

export default function AddressTextField({ name, placeholder, value, onChange, disabled }) {
    return (
        <input
            type="text"
            className={styles.addressTextField}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
        />
    );
}