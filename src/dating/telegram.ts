export function telegram() {
    const url = "https://t.me/share/url?url=" +
        encodeURIComponent("https://t.me/") +
        "&text=" +
        encodeURIComponent("Привет! Давай познакомимся 👋");
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.openTelegramLink)
        tg.openTelegramLink(url);
    else
        window.open(url, "_blank", "noopener,noreferrer");
}
