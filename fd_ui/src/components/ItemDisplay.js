import React, { Fragment, useEffect, useState } from 'react'
import ItemService from '../services/ItemService';
import EditItemRow from './EditItemRow';
import Item from './Item';
import Container from 'react-bootstrap/Container';

const ItemDisplay = ({ id }) => {

    const [items, setItems] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editItemId, setEditItemId] = useState(null);
    const [item, setItem] = useState({
        id: "",
        name: "",
        restId: "",
        price: ""
    })

    const handleChange = (e) => {
        const value = e.target.value;
        setItem({ ...item, [e.target.name]: value });
    };

    const saveItem = (e) => {
        e.preventDefault();
        if (validate()) {
            item.restId = id;
            ItemService.saveItem(item).then((response) => {
                console.log(response)
                fetchData();
            }).catch((error) => {
                console.log(error)
            })
        }
    }
    const [editFormData, setEditFormData] = useState({
        id: item.id,
        name: "",
        restId: item.restId,
        price: ""
    })

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await ItemService.getRestItems(id);
            setItems(response.data);
        } catch (error) {
            console.log(error)
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEditFormChange = (e) => {
        e.preventDefault();

        const fieldName = e.target.getAttribute("name")
        const fieldValue = e.target.value;

        const newFormData = { ...editFormData };
        newFormData[fieldName] = fieldValue;

        setEditFormData(newFormData);
    }

    const fetchItem = async () => {
        try {
            const response = await ItemService.getItemById(editFormData.id)
            setItem(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleEditFormSubmit = (e) => {
        e.preventDefault();
        if (validate) {
            fetchItem();
            ItemService.updateItem(item.id, item).then((response) => {
                console.log(response)
            }).catch((error) => {
                console.log(error)
            })
        }
        fetchData()
    }

    const validate = () => {
        if (item.name === '') {
            alert("Name cannot be blank");
            return false;
        }

        //price
        if (item.price === "") {
            alert("Price cannot be blank");
            return false;
        }
        return true;
    }

    const handleEditClick = (e, item) => {
        e.preventDefault();
        setEditItemId(item.id);

        const formValues = {
            id: item.id,
            name: item.name,
            restId: item.restId,
            price: item.price
        }
        setEditFormData(formValues);
    }

    const deleteItem = (e, id) => {
        e.preventDefault();
        ItemService.deleteItem(id).then((itm) => {
            if (items) {
                setItems((prevElement) => {
                    return prevElement.filter((item) => item.id !== id);
                })
            }
        });
    };

    const handleEditFormCancel = (e) => {
        e.preventDefault()
        setEditItemId(null);
    }


    return (
        <Container className='align-items-center align-content-center p-5 w-75'>
            <form>
                <table className='table' style={{ width: 800 }}>
                    <thead key={"thead"}>
                        <tr>
                            <th scope='col'>Item Id</th>
                            <th scope='col'>Name</th>
                            <th scope='col'>Restaurant Id</th>
                            <th scope='col'>Price</th>
                            <th></th>
                            <th scope='col' className='text-right'>Actions</th>
                            <th></th>
                        </tr>
                    </thead>
                    {!loading && (
                        <tbody key={"tbody"}>
                            {items.map((item) => (
                                <Fragment key={"Fragment" + item.id}>
                                    {editItemId === item.id ? (
                                        <EditItemRow editFormData={editFormData} handleEditFormSubmit={handleEditFormSubmit} handleEditFormChange={handleEditFormChange} key={item.id} />
                                    ) : (
                                        <Item
                                            item={item}
                                            handleEditClick={handleEditClick}
                                            deleteItem={deleteItem}
                                            handleEditFormCancel={handleEditFormCancel}
                                            key={item.id}
                                        />
                                    )}
                                </Fragment>
                            ))}
                        </tbody>
                    )}
                </table>
            </form>
            <form>
                <input
                    type='text'
                    name="name"
                    placeholder='Item Name'
                    value={item.name}
                    onChange={(e) => handleChange(e)}
                    required
                />
                <input
                    type='number'
                    name="price"
                    placeholder='Enter Price'
                    value={item.price}
                    onChange={(e) => handleChange(e)}
                    required
                />
                <button type='submit' onClick={saveItem}>Save</button>
            </form>
        </Container>
    )
}

export default ItemDisplay