import { useEffect, useRef } from 'react'
import { useI18n } from '../i18n/useI18n'
import { CloseIcon, GitHubIcon, LinkedInIcon, MailIcon } from './Icons'
import styles from './AboutDialog.module.css'

interface AboutDialogProps {
    open: boolean
    onClose: () => void
}

export function AboutDialog({ open, onClose }: AboutDialogProps) {
    const { t } = useI18n()
    const dialogRef = useRef<HTMLDialogElement>(null)

    // Sync the native <dialog> with React state (showModal gives focus trapping and Esc)
    useEffect(() => {
        const dialog = dialogRef.current
        if (!dialog) return
        if (open && !dialog.open) dialog.showModal?.()
        if (!open && dialog.open) dialog.close?.()
    }, [open])

    return (
        <dialog
            ref={dialogRef}
            className={styles.dialog}
            aria-labelledby="about-title"
            onClose={onClose}
            // Clicking the backdrop (the dialog element itself) closes it
            onClick={(event) => event.target === event.currentTarget && onClose()}
        >
            <div className={styles.content}>
                <header className={styles.header}>
                    <h2 id="about-title">{t.aboutTitle}</h2>
                    <button
                        type="button"
                        className={styles.close}
                        onClick={onClose}
                        aria-label={t.close}
                    >
                        <CloseIcon />
                    </button>
                </header>

                <p>
                    {t.aboutIntro(
                        <a
                            href="https://www.udemy.com/user/andrewmead/"
                            target="_blank"
                            rel="noopener"
                        >
                            Andrew Mead
                        </a>,
                    )}
                </p>
                <p>
                    {t.aboutData(
                        <a href="https://open-meteo.com/" target="_blank" rel="noopener">
                            Open-Meteo
                        </a>,
                        <a href="https://nominatim.org/" target="_blank" rel="noopener">
                            Nominatim
                        </a>,
                    )}
                </p>

                <h3>{t.getInTouch}</h3>
                <form className={styles.form} method="POST" action="https://formspree.io/xrgywglp">
                    <label>
                        {t.yourEmail}
                        <input type="email" name="_replyto" required autoComplete="email" />
                    </label>
                    <label>
                        {t.message}
                        <textarea name="message" rows={4} required />
                    </label>
                    <button type="submit" className={styles.submit}>
                        {t.sendMessage}
                    </button>
                </form>

                <ul className={styles.social}>
                    <li>
                        <a
                            href="https://www.linkedin.com/in/arlindo-hayashi-b3ab4b56/"
                            target="_blank"
                            rel="noopener"
                        >
                            <LinkedInIcon size={18} /> LinkedIn
                        </a>
                    </li>
                    <li>
                        <a href="https://github.com/tsuuuuu" target="_blank" rel="noopener">
                            <GitHubIcon size={18} /> GitHub
                        </a>
                    </li>
                    <li>
                        <a href="mailto:arlindo.hayashi@gmail.com">
                            <MailIcon size={18} /> {t.email}
                        </a>
                    </li>
                </ul>
            </div>
        </dialog>
    )
}
