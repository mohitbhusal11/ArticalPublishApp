export const getCurrentDateTitle = () => {
    const now = new Date();
    return `Draft ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
};
