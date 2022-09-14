import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Rating } from "primereact/rating";
import { Toolbar } from "primereact/toolbar";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { AutoComplete } from "primereact/autocomplete";
import { OverlayPanel } from "primereact/overlaypanel";
import { Dropdown } from "primereact/dropdown";
import moment from "moment";

import { UtilisateurService } from "../service/UtilisateurService";
import { AgenceService } from "../service/AgenceService";
import { SiegeService } from "../service/SiegeService";

const Crud = () => {
    let emptyProduct = {
        id: "",
        cn: "",
        displayName: "",
        sAMAccountName: "",
        role: null,
        ldapUpn: "",
        responsable_id: null,
        date_inscription: "",
        agence: "agence",
        useragence: [],
        usersiege: [],

        code: "",
        departement: "",
    };

    const [products, setProducts] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const op = useRef(null);
    const op1 = useRef(null);

    const [depSelected, setDepSelected] = useState(null);
    const [sieges, setSieges] = useState(null);

    const [agences, setAgences] = useState([]);
    const [filteredAgences, setFilteredAgences] = useState(null);
    const [roleSelection, setRoleSelection] = useState([]);
    const searchAgence = (event) => {
        setTimeout(() => {
            let _filteredAgences;
            if (!event.query.trim().length) {
                _filteredAgences = [...agences];
            } else {
                _filteredAgences = agences.filter((agence) => {
                    return agence.code_agence.toLowerCase().startsWith(event.query.toLowerCase());
                });
            }

            setFilteredAgences(_filteredAgences);
        }, 150);
    };

    useEffect(() => {
        const utilisateurService = new UtilisateurService();
        utilisateurService.getUtilisateur().then((data) => {
            setProducts(data.message);
            // console.log(data.message);
        });

        const agenceService = new AgenceService();
        agenceService.getAgence().then((data) => {
            setAgences(data.message);
        });
        const siegeService = new SiegeService();
        siegeService.getSiege().then((data) => {
            setSieges(data.message);
        });
    }, []);

    const formatCurrency = (value) => {
        return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
    };

    const selectedRole = (prod) => {
        let result = [];
        if (prod.role == "ac" || prod.role == "cc") {
            result = products?.filter((pd) => pd.role === "ca");
        } else if (prod.role == "ca" || prod.role == "gs") {
            result = products?.filter((pd) => pd.role === "ds");
        } else if (prod.role == "ds") {
            result = products?.filter((pd) => pd.role === "dr");
        } else if (prod.role == "gr" ) {
            result = products?.filter((pd) => pd.role === "cd");
        }

        setRoleSelection(result);
    };
    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);

        if (product) {
            let _products = [...products];
            let _product = { ...product };

            if (
                !product.cn ||
                product.cn == "" ||
                !product.displayName ||
                product.displayName == "" ||
                !product.sAMAccountName ||
                product.sAMAccountName == "" ||
                !product.role ||
                product.role == "" ||
                !product.ldapUpn ||
                product.ldapUpn == "" ||
                !product.ldapUpn.match(/[a-z0-9_\-\.]+@[a-z0-9_\-\.]+\.[a-z]+/i)
            ) {
                toast.current.show({ severity: "error", summary: "Erreur", detail: "Utilisateur non créer", life: 3000 });
            } else {
                if (product.id) {
                    const utilisateurService = new UtilisateurService();
                    utilisateurService.putUtilisateur(product).then((data) => {
                        if (data.error) {
                            toast.current.show({ severity: "error", summary: "Successful", detail: "Utilisateur non modifier", life: 3000 });
                        } else {
                            toast.current.show({ severity: "success", summary: "Successful", detail: "Utilisateur modifier", life: 3000 });
                            utilisateurService.getUtilisateur().then((data) => {
                                setProducts(data.message);
                            });
                        }
                    });
                } else {
                    const utilisateurService = new UtilisateurService();
                    utilisateurService.postUtilisateur(product).then((data) => {
                        if (data.error) {
                            toast.current.show({ severity: "error", summary: "Succès", detail: "Utilisateur non créer", life: 3000 });
                        } else {
                            toast.current.show({ severity: "success", summary: "Successful", detail: "Utilisateur créer", life: 3000 });
                            utilisateurService.getUtilisateur().then((data) => {
                                setProducts(data.message);
                            });
                        }
                    });
                }
                setProductDialog(false);
                setProduct(emptyProduct);
            }

        }
    };

    const editProduct = (product) => {
        setProduct({ ...product });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };
    const typeSelectItems1 = [
        { label: "Capital Humain", value: "Capital Humain" },
        { label: "Organisation & AMO", value: "Organisation & AMO" },
        { label: "Système d'Information", value: "Système d'Information" },
        { label: "Juridique", value: "Juridique" },
        { label: "Audit", value: "Audit" },
        { label: "Développement", value: "Développement" },
        { label: "Marketing", value: "Marketing" },
        { label: "Recouvrement", value: "Recouvrement" },
        { label: "Finance & Comptabilité", value: "Finance & Comptabilité" },
    ];
    const deleteProduct = () => {
        const utilisateurService = new UtilisateurService();

        utilisateurService.deleteUtilisateur(product).then((data) => {
            if (!data.error) {
                utilisateurService.getUtilisateur().then((data) => {
                    setProducts(data.message);
                });
                toast.current.show({ severity: "success", summary: "Successful", detail: "utilisateur supprimer ", life: 3000 });
            } else {
                toast.current.show({ severity: "error", summary: "Erreur", detail: "utilisateur non supprimer", life: 3000 });
            }
        });

        setDeleteProductDialog(false);
        setProduct(emptyProduct);
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = "";
        let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const exportExcel = () => {
        import("xlsx").then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(products);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
            const excelBuffer = xlsx.write(workbook, { bookType: "xlsx", type: "array" });
            saveAsExcelFile(excelBuffer, "products");
        });
    };

    const saveAsExcelFile = (buffer, fileName) => {
        import("file-saver").then((module) => {
            if (module && module.default) {
                let EXCEL_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
                let EXCEL_EXTENSION = ".xlsx";
                const data = new Blob([buffer], {
                    type: EXCEL_TYPE,
                });

                module.default.saveAs(data, "export_" + moment(new Date()).format("DD-MM-YYYY") + EXCEL_EXTENSION);
            }
        });
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = () => {
        let _products = products.filter((val) => !selectedProducts.includes(val));
        setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current.show({ severity: "success", summary: "Successful", detail: "Products Deleted", life: 3000 });
    };

    const onCategoryChange = (e) => {
        let _product = { ...product };
        _product["agence"] = e.value;
        setProduct(_product);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _product = { ...product };
        if (name == "code_gest") {
            if (val.length < 4) {
                _product[`${name}`] = val;

                setProduct(_product);
            } else {
                toast.current.show({ severity: "warn", summary: "Attention", detail: "code gest doit contenir 3 caractères", life: 3000 });
            }
        } else {
            _product[`${name}`] = val;

            setProduct(_product);
        }
        if (name == "role") {
            selectedRole(_product);
        }
    };
    const onInputSiegeChange = (e) => {
        const val = (e.target && e.target.value) || "";
        let _product = { ...product };
        _product[`usersiege`] && _product[`usersiege`].length > 0 ? (_product[`usersiege`][0].siege_id = val) : _product[`usersiege`].push({ siege_id: val });

        setProduct(_product);
    };
    const onInputDepChange = (e) => {
        const val = (e.target && e.target.value) || "";
        let _product = { ...product };
        _product[`usersiege`] && _product[`usersiege`].length > 0 ? (_product[`usersiege`][0].departement = val) : _product[`usersiege`].push({ departement: val });

        setProduct(_product);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Ajouter" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                {/* <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} /> */}
                <Button label="Exporter" type="button" icon="pi pi-file-excel" onClick={exportExcel} className="p-button-help " data-pr-tooltip="XLS" />
            </React.Fragment>
        );
    };

    const codeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Code</span>
                {rowData.code}
            </>
        );
    };

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };

    const imageBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Image</span>
                <img src={`assets/demo/images/product/${rowData.image}`} alt={rowData.image} className="shadow-2" width="100" />
            </>
        );
    };

    const priceBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Price</span>
                {formatCurrency(rowData.price)}
            </>
        );
    };

    const categoryBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Category</span>
                {rowData.category}
            </>
        );
    };

    const ratingBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Reviews</span>
                <Rating value={rowData.rating} readonly cancel={false} />
            </>
        );
    };

    const statusBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                <span className={`product-badge status-${rowData.inventoryStatus.toLowerCase()}`}>{rowData.inventoryStatus}</span>
            </>
        );
    };

    const typeSelectItems = [
        { label: "Chef de département", value: "cd" },
        { label: "Agent de crédit", value: "ac" },
        { label: "Chargé de clientèle", value: "cc" },
        { label: "Gestionnaire des réclamations", value: "gr" },
        { label: "Gestionnaire", value: "gs" },
        { label: "Entité compétente", value: "ec" },
        { label: "Directeur de régionale", value: "dr" },
        { label: "Chef d'agence", value: "ca" },
        { label: "Directeur de succursale", value: "ds" },
    ];

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteProduct(rowData)} />
            </div>
        );
    };

    const dateBodyTemplate = (rowData) => {
        return <div>{moment(rowData?.date_inscription).format("YYYY/MM/DD")}</div>;
    };
    const roleBodyTemplate = (rowData) => {
        const result = typeSelectItems.filter((rl) => rl.value === rowData?.role);
        return <div>{result[0]?.label}</div>;
    };
    const respoBodyTemplate = (rowData) => {
        return <div>{rowData.responsable_id?.displayName}</div>;
    };
    const respoBodyTemplate1 = (rowData) => {
        return <div>{rowData.siege_id?.departement}</div>;
    };
    const depBodyTemplate = (rowData) => {
        return rowData.useragence.length > 0 ? (
            <div className="actions">
                <Button
                    icon="pi pi-eye"
                    className="p-button-rounded p-button-primary mr-2"
                    onClick={(e) => {
                        setSelectedProduct(rowData);
                        op.current.toggle(e);
                    }}
                />
            </div>
        ) : (
            <div className="actions">
                <Button icon="pi pi-eye-slash" className="p-button-rounded p-button-danger mr-2" />
            </div>
        );
    };
    const siegeBodyTemplate = (rowData) => {
        return rowData.usersiege?.length > 0 ? (
            <div className="actions">
                <Button
                    icon="pi pi-eye"
                    className="p-button-rounded p-button-primary mr-2"
                    onClick={(e) => {
                        console.log(rowData);
                        setSelectedProduct(rowData);
                        op1.current.toggle(e);
                    }}
                />
            </div>
        ) : (
            <div className="actions">
                <Button icon="pi pi-eye-slash" className="p-button-rounded p-button-danger mr-2" />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gestion des utilisateurs</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="recherche" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Recherche..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Annuler" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Enregistrer" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="Non" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Oui" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="Non" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
            <Button label="Oui" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProducts} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={products}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        globalFilter={globalFilter}
                        emptyMessage="Aucun utilisateur trouvé."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column field="id" header="Id" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="cn" header="CN" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="displayName" header="Nom Complet" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="sAMAccountName" header="Compte Ldap" sortable headerStyle={{ width: "14%", minWidth: "8rem" }}></Column>
                        <Column field="role" header="Role" sortable body={roleBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="agence" header="agence Ou Siege" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="date_inscription" header="date inscription" sortable body={dateBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="ldapUpn" header="E-mail" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="responsable_id" header="Résponsable" sortable body={respoBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="usersiege" header="Code siege" sortable body={siegeBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="useragence" header="code de l'agence" body={depBodyTemplate} sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>
                    <OverlayPanel ref={op} showCloseIcon id="overlay_panel" style={{ width: "250px" }} className="overlaypanel-demo">
                        <DataTable value={selectedProduct?.useragence}>
                            <Column field="code_agence" header="Code d'agence" sortable />
                        </DataTable>
                    </OverlayPanel>
                    <OverlayPanel ref={op1} showCloseIcon id="overlay_panel" style={{ width: "250px" }} className="overlaypanel-demo">
                        <DataTable value={selectedProduct?.usersiege}>
                            {/* <Column field="siege_id.code" header="Code de siege" /> */}
                            <Column field="departement" header="département" />
                        </DataTable>
                    </OverlayPanel>

                    <Dialog visible={productDialog} style={{ width: "850px" }} header="Détails Utilisateur" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="displayName">Nom Complet</label>
                                <InputText id="displayName" value={product.displayName} onChange={(e) => onInputChange(e, "displayName")} required autoFocus className={classNames({ "p-invalid": submitted && !product.displayName })} />
                                {submitted && !product.displayName && <small className="p-invalid">Nom Complet est obligatoire.</small>}
                            </div>

                            <div className="field col">
                                <label htmlFor="sAMAccountName">Compte Ldap</label>
                                <InputText id="sAMAccountName" value={product.sAMAccountName} onChange={(e) => onInputChange(e, "sAMAccountName")} required className={classNames({ "p-invalid": submitted && !product.sAMAccountName })} />
                                {submitted && !product.sAMAccountName && <small className="p-invalid">Compte est obligatoire.</small>}
                            </div>
                            <div className="field col">
                                <label htmlFor="ldapUpn">E-mail</label>
                                <InputText id="ldapUpn" value={product.ldapUpn} onChange={(e) => onInputChange(e, "ldapUpn")} required className={classNames({ "p-invalid": submitted && !product.ldapUpn })} />
                                {submitted && !product.ldapUpn && <small className="p-invalid">Email est obligatoire.</small>}
                                {submitted && product.ldapUpn && !product.ldapUpn.match(/[a-z0-9_\-\.]+@[a-z0-9_\-\.]+\.[a-z]+/i) && <small className="p-invalid">Email n'est pas correcte.</small>}
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="cn">CN</label>
                                <InputText id="cn" value={product.cn} onChange={(e) => onInputChange(e, "cn")} required className={classNames({ "p-invalid": submitted && !product.cn })} />
                                {submitted && !product.cn && <small className="p-invalid">CN est obligatoire.</small>}
                            </div>

                            <div className="field col">
                                <label htmlFor="role">Role</label>
                                <Dropdown id="role" value={product.role} options={typeSelectItems} onChange={(e) => onInputChange(e, "role")} required className={classNames({ "p-invalid": submitted && !product.role })} />
                                {submitted && !product.role && <small className="p-invalid">Role est obligatoire.</small>}
                            </div>
                        </div>
                        {product.role && (
                            <div className="formgrid grid">
                                <div className="field col">
                                    <label htmlFor="responsable">Résponsable</label>
                                    <Dropdown
                                        id="responsable"
                                        value={product.responsable_id}
                                        options={roleSelection}
                                        onChange={(e) => onInputChange(e, "responsable_id")}
                                        optionLabel="displayName"
                                        filter
                                        showClear
                                        filterBy="displayName"
                                        placeholder="Résponsable"
                                        className={classNames({ "p-invalid": submitted && !product.responsable_id })}
                                    />

                                    {submitted && !product.responsable_id && <small className="p-invalid">Résponsable est obligatoire.</small>}
                                </div>
                            </div>
                        )}

                        <div className="field">
                            <label className="mb-3"></label>
                            <div className="formgrid grid">
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category1" name="category" value="agence" onChange={onCategoryChange} checked={product.agence === "agence"} />
                                    <label htmlFor="category1">Agence</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category2" name="category" value="siege" onChange={onCategoryChange} checked={product.agence === "siege"} />
                                    <label htmlFor="category2">Siege</label>
                                </div>
                            </div>
                        </div>
                        {product.agence === "agence" && (
                            <div className="field">
                                <label className="mb-3">Agences</label>
                                <AutoComplete value={product.useragence} suggestions={filteredAgences} completeMethod={searchAgence} field="code_agence" multiple onChange={(e) => onInputChange(e, "useragence")} aria-label="Agences" />
                            </div>
                        )}

                        <div className="formgrid grid">
                            {/* {product.agence === "siege" && (
                                <div className="field col">
                                    <label htmlFor="siege_id">Siege</label>
                                    <Dropdown ref={op1} value={(product.usersiege && product.usersiege.length > 0 && product.usersiege[0].siege_id) ? product.usersiege[0]?.siege_id : null} options={sieges} onChange={(e) => onInputSiegeChange(e)} optionLabel="code" filter showClear filterBy="code" placeholder="Siege..." />
                                </div>
                            )} */}

                            {product.agence !== "agence" && (
                                <div className="field col">
                                    <label htmlFor="departement">Département</label>
                                    <Dropdown id="departement" value={product.usersiege[0]?.departement || null} options={typeSelectItems1} onChange={(e) => onInputDepChange(e)} placeholder="Département" className={classNames({ "p-invalid": submitted && !product.usersiege[0]?.departement })} />
                                    {submitted && !product.usersiege[0]?.departement && <small className="p-invalid">département est obligatoire.</small>}
                                </div>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: "450px" }} header="Confirmation" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {product && (
                                <span>
                                    Etes-vous sûr que vous voulez supprimer cet utilisateur <b>{product.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: "450px" }} header="Confirmation" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {product && <span>Etes-vous sûr que vous voulez supprimer cet utilisateur</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Crud, comparisonFn);
