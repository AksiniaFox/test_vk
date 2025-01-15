import { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { List, Button, Spin, Modal, Form, Input, Switch } from 'antd';
import { itemStore } from '../stores/ItemStore';

interface Item {
  id: number;
  name: string;
  description: string;
}

const ItemList = observer(() => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [form] = Form.useForm();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [filterWithDescription, setFilterWithDescription] = useState(false);

  useEffect(() => {
    itemStore.fetchItems();
  }, []);

  const handleScroll = () => {
    if (
      loadMoreRef.current &&
      loadMoreRef.current.getBoundingClientRect().bottom <= window.innerHeight
    ) {
      itemStore.fetchItems();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const showModal = (item: Item) => {
    setCurrentItem(item);
    form.setFieldsValue({ name: item.name, description: item.description });
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (currentItem) {
      form
        .validateFields()
        .then((values) => {
          itemStore.editItem(currentItem.id, values.name, values.description);
          setIsModalVisible(false);
        })
        .catch((info) => {
          console.log(info);
        });
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const renderItem = (item: Item) => (
    <List.Item
      key={item.id}
      actions={[
        <Button key="delete" onClick={() => itemStore.deleteItem(item.id)}>
          Удалить
        </Button>,
        <Button key="edit" onClick={() => showModal(item)}>
          Изменить
        </Button>,
      ]}
    >
      <div>
        <h3>{item.name}</h3>
        <p>{item.description}</p>
      </div>
    </List.Item>
  );

  const filteredItems = filterWithDescription
    ? itemStore.items.filter((item) => !!item.description)
    : itemStore.items;

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <Switch
          checked={filterWithDescription}
          onChange={setFilterWithDescription}
          checkedChildren="С описанием"
          unCheckedChildren="Все элементы"
        />
      </div>

      <List
        loading={itemStore.loading}
        dataSource={filteredItems}
        renderItem={renderItem}
        footer={itemStore.loading ? <Spin /> : null}
      />
      <div ref={loadMoreRef}></div>

      <Modal
        title="Изменить"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose
      >
        <Form form={form} layout="vertical" name="edit_item_form">
          <Form.Item
            label="Название"
            name="name"
            rules={[{ required: true, message: 'Введите название!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Описание"
            name="description"
            rules={[{ required: true, message: 'Введите описание!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
});

export default ItemList;
