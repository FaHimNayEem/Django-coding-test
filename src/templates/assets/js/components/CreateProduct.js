import Axios from 'axios';
import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';


const CreateProduct = (props) => {

    const [productVariantPrices, setProductVariantPrices] = useState([])

    const [productVariants, setProductVariant] = useState([
        {
            option: 1,
            tags: []
        }
    ])

    const [files, setFiles] = useState([]);

    const [formData, setFormData] = useState({
        title: "",
        sku: "",
        description: "",
    });

    const setForm = (event) => {
        const { name, value } = event.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    console.log(productVariantPrices, productVariants);
    // handle click event of the Add button
    const handleAddClick = () => {
        let all_variants = JSON.parse(props.variants.replaceAll("'", '"')).map(el => el.id)
        let selected_variants = productVariants.map(el => el.option);
        let available_variants = all_variants.filter(entry1 => !selected_variants.some(entry2 => entry1 == entry2))
        setProductVariant([...productVariants, {
            option: available_variants[0],
            tags: []
        }])
    };

    // handle input change on tag input
    const handleInputTagOnChange = (value, index) => {
        let product_variants = [...productVariants]
        product_variants[index].tags = value
        setProductVariant(product_variants)

        checkVariant()
    }

    // remove product variant
    const removeProductVariant = (index) => {
        let product_variants = [...productVariants]
        product_variants.splice(index, 1)
        setProductVariant(product_variants)
    }

    // check the variant and render all the combination
    const checkVariant = () => {
        let tags = [];

        productVariants.filter((item) => {
            tags.push(item.tags)
        })

        setProductVariantPrices([])

        getCombn(tags).forEach(item => {
            setProductVariantPrices(productVariantPrice => [...productVariantPrice, {
                title: item,
                price: 0,
                stock: 0
            }])
        })
    }

    const handleProductVariantPriceStock = (index, name, value) => {
        const newProductVariantPrices = productVariantPrices.map((item, i) => i == index ? { ...item, [name]: Number(value) } : item)
        setProductVariantPrices(newProductVariantPrices);
    }

    // combination algorithm
    function getCombn(arr, pre) {
        pre = pre || '';
        if (!arr.length) {
            return pre;
        }
        let ans = arr[0].reduce(function (ans, value) {
            return ans.concat(getCombn(arr.slice(1), pre + value + '/'));
        }, []);
        return ans;
    }

    // Save product
    let saveProduct = (event) => {
        event.preventDefault();
        // TODO : write your code here to save the product
        const product = {
            ...formData,
            product_variant: productVariants,
            product_variant_prices: productVariantPrices,
            product_image: files
        }

        Axios.post('/product/create', product)
            .then(response => {
                console.log(response.data);
            }).catch(err => {
                console.log(err);
            })

        console.log(product);
    }


    return (
        <div>
            <section>
                <div className="row">
                    <div className="col-md-6">
                        <div className="card shadow mb-4">
                            <div className="card-body">
                                <div className="form-group">
                                    <label htmlFor="">Product Name</label>
                                    <input type="text" placeholder="Product Name" value={formData.name} onChange={setForm}
                                        className="form-control" name='title' />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="">Product SKU</label>
                                    <input type="text" placeholder="Product Name" value={formData.sku} onChange={setForm}
                                        className="form-control" name='sku' />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="">Description</label>
                                    <textarea id="" cols="30" rows="4" className="form-control" value={formData.description}
                                        onChange={setForm} name='description' />
                                </div>
                            </div>
                        </div>

                        <div className="card shadow mb-4">
                            <div
                                className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                <h6 className="m-0 font-weight-bold text-primary">Media</h6>
                            </div>
                            <div className="card-body border">
                                <Dropzone onDrop={acceptedFiles => setFiles(acceptedFiles)}>
                                    {({ getRootProps, getInputProps }) => (
                                        <section>
                                            <div {...getRootProps()}>
                                                <input {...getInputProps()} />
                                                <p>Drag 'n' drop some files here, or click to select files</p>
                                            </div>
                                        </section>
                                    )}
                                </Dropzone>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="card shadow mb-4">
                            <div
                                className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                <h6 className="m-0 font-weight-bold text-primary">Variants</h6>
                            </div>
                            <div className="card-body">

                                {
                                    productVariants.map((element, index) => {
                                        return (
                                            <div className="row" key={index}>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="">Option</label>
                                                        <select className="form-control" defaultValue={element.option}>
                                                            {
                                                                JSON.parse(props.variants.replaceAll("'", '"')).map((variant, index) => {
                                                                    return (<option key={index}
                                                                        value={variant.id}>{variant.title}</option>)
                                                                })
                                                            }

                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="col-md-8">
                                                    <div className="form-group">
                                                        {
                                                            productVariants.length > 1
                                                                ? <label htmlFor="" className="float-right text-primary"
                                                                    style={{ marginTop: "-30px" }}
                                                                    onClick={() => removeProductVariant(index)}>remove</label>
                                                                : ''
                                                        }

                                                        <section style={{ marginTop: "30px" }}>
                                                            <TagsInput value={element.tags}
                                                                style="margin-top:30px"
                                                                onChange={(value) => handleInputTagOnChange(value, index)} />
                                                        </section>

                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }


                            </div>
                            <div className="card-footer">
                                {productVariants.length !== 3
                                    ? <button className="btn btn-primary" onClick={handleAddClick}>Add another
                                        option</button>
                                    : ''
                                }

                            </div>

                            <div className="card-header text-uppercase">Preview</div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <td>Variant</td>
                                                <td>Price</td>
                                                <td>Stock</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                productVariantPrices.map((productVariantPrice, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{productVariantPrice.title}</td>
                                                            <td><input className="form-control" onChange={(e) => handleProductVariantPriceStock(index, 'price', e.target.value)} type="text" /></td>
                                                            <td><input className="form-control" onChange={(e) => handleProductVariantPriceStock(index, 'stock', e.target.value)} type="text" /></td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button type="button" onClick={saveProduct} className="btn btn-lg btn-primary">Save</button>
                <button type="button" className="btn btn-secondary btn-lg">Cancel</button>
            </section>
        </div>
    );
};

export default CreateProduct;
