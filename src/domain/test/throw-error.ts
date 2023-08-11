export const throwError = async (): Promise<never> => await Promise.reject(new Error())
