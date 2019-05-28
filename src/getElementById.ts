export const getElementById = <T extends HTMLElement>(id: string) => {
  const el = document.getElementById(id) as T | null;
  if (el === null) {
    throw new Error(`could not find Element with id ${id}`);
  }
  return el;
};
