export const generateMessage = (text: String) => {
    return {
        text,
        createdAt: new Date().getTime()
    }
}

export const generateLocationMessage = (url: String) => {
    return {
        url,
        createdAt: new Date().getTime()
    }
}