import { makeAutoObservable } from 'mobx';
import axios from 'axios';

interface Item {
  id: number;
  name: string;
  description: string;
}

class ItemStore {
  items: Item[] = [];
  loading: boolean = false;
  page: number = 1;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchItems() {
    this.loading = true;
    try {
      const response = await axios.get(
        `https://api.github.com/search/repositories?q=javascript&sort=stars&order=asc&page=${this.page}`
      );
      const newItems = response.data.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
      }));
      this.items = [...this.items, ...newItems];
      this.page++;
    } catch (error) {
      console.error('Ошибка получения данных:', error);
    } finally {
      this.loading = false;
    }
  }

  deleteItem(id: number) {
    this.items = this.items.filter((item) => item.id !== id);
  }

  editItem(id: number, newName: string, newDescription: string) {
    const item = this.items.find((item) => item.id === id);
    if (item) {
      item.name = newName;
      item.description = newDescription;
    }
  }
}

export const itemStore = new ItemStore();
