type EntityKey = "contacts" | "groups";

class StorageService {
  static save<T>(key: EntityKey, data: T): void {
    try {
      const existingData = this.getAll<T>(key);
      const updatedData = Array.isArray(existingData)
        ? [...existingData, data]
        : [data];
      localStorage.setItem(key, JSON.stringify(updatedData));
    } catch (error) {
      console.error(error);
    }
  }

  static getAll<T>(key: EntityKey): T[] {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  static getOne<T extends { id: string }>(
    key: EntityKey,
    id: string
  ): T | undefined {
    try {
      const items = this.getAll<T>(key);
      return items.find((item) => item.id === id);
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  static delete<T extends { id: string }>(key: EntityKey, id: string): void {
    try {
      const items = this.getAll<T>(key);
      const filteredItems = items.filter((item) => item.id !== id);
      localStorage.setItem(key, JSON.stringify(filteredItems));
    } catch (error) {
      console.error(error);
    }
  }
}

export default StorageService;
