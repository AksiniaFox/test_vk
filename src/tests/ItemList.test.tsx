import { render, screen, fireEvent } from '@testing-library/react';
import { itemStore } from '../stores/ItemStore';
import ItemList from '../components/ItemList';

jest.mock('../stores/ItemStore', () => ({
  itemStore: {
    items: [
      { id: 1, name: 'Item 1', description: 'Description 1' },
      { id: 2, name: 'Item 2', description: '' },
    ],
    loading: false,
    deleteItem: jest.fn(),
    fetchItems: jest.fn(),
  },
}));

describe('ItemList', () => {
  it('Рендер компонентов проходит корректно', () => {
    render(<ItemList />);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.queryByText('Описание отсутствует')).not.toBeInTheDocument();
  });

  it('Вызывает удаление при клике на кнопку "удаление"', () => {
    render(<ItemList />);
    const deleteButtons = screen.getAllByText('Удалить');
    fireEvent.click(deleteButtons[0]);
    expect(itemStore.deleteItem).toHaveBeenCalledWith(1);
  });

  it('Крутится спиннер при загрузке', () => {
    itemStore.loading = true;
    render(<ItemList />);
    expect(document.querySelector('.ant-spin')).toBeInTheDocument();
  });
});
