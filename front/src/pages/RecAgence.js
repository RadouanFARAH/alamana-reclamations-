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
import { ReclamationService } from "../service/ReclamationService";
import moment from "moment";

const Crud = () => {
    let emptyProduct = {
        id: "0",
        user_id: "",
        type: "",
        communication: "",
        traitement: "",
        etat: "",
        reponse: "",
    };

    const [products, setProducts] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [productDialog2, setProductDialog2] = useState(false);

    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        const reclamationService = new ReclamationService();

        reclamationService.getReclamationsNotif().then((data) => {
            let reclamations = new Array();
            for (let index = 0; index < data.message.length; index++) {
                const reclamation = data.message[index];

                reclamation.date_reception && (reclamation.date_reception = moment(reclamation.date_reception).format("YYYY/MM/DD"));
                reclamation.traitement_id?.date_affectation && (reclamation.traitement_id.date_affectation = moment(reclamation.traitement_id.date_affectation).format("YYYY/MM/DD"));
                reclamation.traitement_id?.date_traitement && (reclamation.traitement_id.date_traitement = moment(reclamation.traitement_id.date_traitement).format("YYYY/MM/DD"));
                reclamation.traitement_id?.date_cloturation && (reclamation.traitement_id.date_cloturation = moment(reclamation.traitement_id.date_cloturation).format("YYYY/MM/DD"));
                reclamations.push(reclamation);
            }
            console.log(reclamations);
            setProducts(reclamations);
        });
    }, []);

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

        if (product.name.trim()) {
            let _products = [...products];
            let _product = { ...product };
            if (product.id) {
                const index = findIndexById(product.id);

                _products[index] = _product;
                toast.current.show({ severity: "success", summary: "succès ", detail: "Réclamation Modifier", life: 3000 });
            } else {
                _product.id = createId();
                _product.image = "product-placeholder.svg";
                _products.push(_product);
                toast.current.show({ severity: "success", summary: "succès ", detail: "Réclamation Créé", life: 3000 });
            }

            setProducts(_products);
            setProductDialog(false);
            setProduct(emptyProduct);
        }
    };

    const editProduct = (product) => {
        setProduct({ ...product });
        setProductDialog(true);
    };
    const detailProduct = (product) => {
        setProduct({ ...product });
        setProductDialog2(true);
    };

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        let _products = products.filter((val) => val.id !== product.id);
        setProducts(_products);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        toast.current.show({ severity: "success", summary: "Successful", detail: "Product Deleted", life: 3000 });
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
        _product["category"] = e.value;
        setProduct(_product);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    };

    const leftToolbarTemplate = () => {
        return <React.Fragment></React.Fragment>;
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                {/* <Button label="Exporter" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} /> */}
                <Button label="Exporter" type="button" icon="pi pi-file-excel" onClick={exportExcel} className="p-button-help " data-pr-tooltip="XLS" />
            </React.Fragment>
        );
    };

    const codeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Id</span>
                {rowData.id < 10 && "000" + rowData.id}
                {rowData.id < 100 && rowData.id >= 10 && "00" + rowData.id}
                {rowData.id < 1000 && rowData.id >= 100 && "0" + rowData.id}
                {rowData.id >= 1000 && rowData.id}
            </>
        );
    };

    const restraitementBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Responsable du traitement</span>

                {rowData.traitement_id?.user_id.displayName || <i className="pi pi-spin pi-spinner" style={{ fontSize: "2em" }}></i>}
            </>
        );
    };
    const daBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Date affectation</span>
                {rowData.traitement_id?.date_affectation || <i className="pi pi-spin pi-spinner" style={{ fontSize: "2em" }}></i>}
            </>
        );
    };
    const dtBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Date traitement</span>
                {rowData.traitement_id?.date_traitement || <i className="pi pi-spin pi-spinner" style={{ fontSize: "2em" }}></i>}
            </>
        );
    };
    const dcBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Date cloturation</span>
                {rowData.traitement_id?.date_cloturation || <i className="pi pi-spin pi-spinner" style={{ fontSize: "2em" }}></i>}
            </>
        );
    };
    const reponseBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Réponse</span>
                {rowData.traitement_id?.reponse || <i className="pi pi-spin pi-spinner" style={{ fontSize: "2em" }}></i>}
            </>
        );
    };
    const delaiTemplate = (rowData) => {
        if (rowData.traitement_id) {
            console.log(moment(rowData.traitement_id.date_affectation, "YYYY/MM/DD").add(rowData.traitement_id.cpt_traiteur, "days").format("YYYY/MM/DD"));
            console.log(moment(new Date()).format("YYYY/MM/DD"));
            if (
                rowData.traitement_id.cpt_traiteur &&
                moment(rowData.traitement_id.date_affectation, "YYYY/MM/DD").add(rowData.traitement_id.cpt_traiteur, "days").format("YYYY/MM/DD") > moment(rowData.traitement_id?.date_traitement ? new Date(rowData.traitement_id.date_traitement) : new Date()).format("YYYY/MM/DD")
            ) {
                return (
                    <>
                        <span className="p-column-title">etat</span>
                        <span style={{ color: "green" }}>{rowData.etat}</span>
                    </>
                );
            } else {
                return (
                    <>
                        <span className="p-column-title">etat</span>
                        <span style={{ color: "red" }}>{rowData.etat}</span>
                    </>
                );
            }
        } else {
            return (
                <>
                    <span className="p-column-title">etat</span>
                    {rowData.etat}
                </>
            );
        }
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
        // return (
        //     <>
        //         <span className="p-column-title">Price</span>
        //         {formatCurrency(rowData.price)}
        //     </>
        // );
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
    const hideDetailProductDialog = () => {
        setSubmitted(false);
        setProductDialog2(false);
    };
    const statusBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                <span className={`product-badge status-${rowData.inventoryStatus.toLowerCase()}`}>{rowData.inventoryStatus}</span>
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Réclamations</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Rechercher..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="annuler" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="enregister" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProducts} />
        </>
    );
    const actionBodyTemplate2 = (rowData) => {
        return <Button icon="pi pi-eye" className="p-button-rounded p-button-danger mr-2" onClick={() => detailProduct(rowData)} />;
    };

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
                        currentPageReportTemplate="Affichage {first} pour {last} de {totalRecords} réclamations"
                        globalFilter={globalFilter}
                        emptyMessage="Aucun réclamation trouvé."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        {/* local/centrale les deux  */}
                        <Column body={actionBodyTemplate2}></Column>

                        {/* <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column> */}
                        <Column field="id" header="Id" sortable body={codeBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="user_id.displayName" header="Utilisateur" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="traitement_id.user_id.displayName" header="Responsable du traitement" body={restraitementBodyTemplate} sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="type" header="Type" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="traitement" header="Canal de Traitement" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="communication" header="Canal de Communication" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="date_reception" header="Date réception" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="traitement_id.date_affectation" header="Date affectation" body={daBodyTemplate} sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="traitement_id.date_traitement" header="Date traitement" body={dtBodyTemplate} sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="traitement_id.date_cloturation" header="Date cloturation" body={dcBodyTemplate} sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="traitement_id.reponse" header="Réponse" body={reponseBodyTemplate} sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="etat" header="État" body={delaiTemplate} sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                    </DataTable>

                    <Dialog visible={productDialog2} style={{ width: "900px" }} modal className="p-fluid" onHide={hideDetailProductDialog}>
                        <h5>
                            <b style={{ color: "black" }}>Détails Réclamation :</b>{" "}
                        </h5>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="id">
                                    <b>Id :</b>{" "}
                                </label>
                                <p>
                                    {" "}
                                    {product.id < 10 && "000" + product.id}
                                    {product.id < 100 && product.id >= 10 && "00" + product.id}
                                    {product.id < 1000 && product.id >= 100 && "0" + product.id}
                                    {product.id >= 1000 && product.id}
                                </p>
                            </div>
                            <div className="field col">
                                <label htmlFor="reception">
                                    <b>Date reception</b> :
                                </label>
                                <div>{moment(product?.date_reception).format("YYYY/MM/DD")}</div>
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="type">
                                    <b>Calification :</b>
                                </label>
                                <p>{product.calification}</p>
                            </div>
                            <div className="field col">
                                <label htmlFor="etat">
                                    <b>Etat :</b>
                                </label>
                                <p>{product.etat}</p>
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="traitement">
                                    <b>Canal de traitement :</b>
                                </label>
                                <p>{product.traitement}</p>
                            </div>
                            <div className="field col">
                                <label htmlFor="communication">
                                    <b>Canal de communication :</b>
                                </label>
                                <p>{product.communication}</p>
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="type">
                                    <b>Type de réclamation :</b>
                                </label>
                                <p>{product.type}</p>
                            </div>
                            <div className="field col">
                                <label htmlFor="sous-type">
                                    <b>Sous type :</b>
                                </label>
                                <p>{product.sous_type}</p>
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="utilisateur">
                                    <b>Utilisateur :</b>{" "}
                                </label>
                                <p>{product.user_id.displayName}</p>
                            </div>
                            <div className="field col">
                                <label htmlFor="type">
                                    <b>Responsable du traitement :</b>
                                </label>
                                <p>{product.user_id?.displayName}</p>
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="sous-type">
                                    <b>date d'affectation :</b>
                                </label>
                                <p>{moment(product.traitement_id?.date_affectation).format("YYYY/MM/DD")}</p>
                            </div>
                            <div className="field col">
                                <label htmlFor="traitement">
                                    <b>Date de traitement :</b>
                                </label>
                                <br />
                                {product.traitement_id?.date_traitement || <i className="pi pi-spin pi-spinner" style={{ fontSize: "2em" }}></i>}
                            </div>

                            <div className="field col">
                                <label htmlFor="traitement">
                                    <b>Date de cloturation :</b>
                                </label>
                                <br />
                                {product.traitement_id?.date_cloturation || <i className="pi pi-spin pi-spinner" style={{ fontSize: "2em" }}></i>}
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="description">
                                    <b>Description :</b>
                                </label>
                                <p>{product.description}</p>
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="Reponse">
                                    <b>Reponse :</b>
                                </label>
                                <p>{product.traitement_id?.reponse}</p>
                            </div>
                        </div>

                        <hr></hr>
                        <h5>
                            <b style={{ color: "black" }}>Détails Client : </b>
                            {product.client}
                        </h5>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="nom">
                                    <b>Nom :</b>{" "}
                                </label>
                                <p>{product.nom}</p>
                            </div>
                            <div className="field col">
                                <label htmlFor="prenom">
                                    <b>Prénom :</b>{" "}
                                </label>
                                <p>{product.prenom}</p>
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="cin">
                                    <b>Cin :</b>{" "}
                                </label>
                                <p>{product.cin}</p>
                            </div>
                            <div className="field col">
                                <label htmlFor="tiers">
                                    <b>N°tiers :</b>{" "}
                                </label>
                                <p>{product.tiers}</p>
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="adress">
                                    <b>Adresse :</b>{" "}
                                </label>
                                <p>{product.adress}</p>
                            </div>
                            <div className="field col">
                                <label htmlFor="telephone">
                                    <b>Téléphone :</b>{" "}
                                </label>
                                <p>{product.telephone}</p>
                            </div>
                        </div>
                    </Dialog>

                    {/* <Dialog visible={productDialog} style={{ width: '950px' }} header="Ajouter Réclamation" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>                        
                        {product.image && <img src={`assets/demo/images/product/${product.image}`} alt={product.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="formgrid grid">
                        <div className="field col">
                            <label htmlFor="name">Nom</label>
                            <InputText id="name" value={product.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
                            {submitted && !product.name && <small className="p-invalid">Nom est obligatoire.</small>}
                        </div>
                        <div className="field col">
                            <label htmlFor="name">Prénom</label>
                            <InputText id="name" value={product.description} onChange={(e) => onInputChange(e, 'description')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.description })} />
                            {submitted && !product.description && <small className="p-invalid">Prénom est obligatoire.</small>}
                        </div>
                        </div>
                        
                        <div className="formgrid grid">
                        <div className="field col">
                            <label htmlFor="name">Cin</label>
                            <InputText id="name" value={product.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
                            {submitted && !product.name && <small className="p-invalid">Cin est obligatoire.</small>}
                        </div>
                        <div className="field col">
                            <label htmlFor="name">Adress</label>
                            <InputText id="name" value={product.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
                            {submitted && !product.name && <small className="p-invalid">l'Adress est obligatoire.</small>}
                        </div>
                        </div>

                        <div className="formgrid grid">
                        <div className="field col">
                            <label htmlFor="name">N° tiers</label>
                            <InputText id="name" value={product.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
                            {submitted && !product.name && <small className="p-invalid">N° tiers est obligatoire.</small>}
                        </div>
                        <div className="field col">
                            <label htmlFor="name">Delai de traitement</label>
                            <InputText id="name" value={product.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
                            {submitted && !product.name && <small className="p-invalid">Delai de traitement est obligatoire.</small>}
                        </div>

                        <div className="field col">
                            <label htmlFor="name">Téléphone</label>
                            <InputText id="name" value={product.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
                            {submitted && !product.name && <small className="p-invalid">Téléphone est obligatoire.</small>}
                        </div>
                        </div>

                        <div className="formgrid grid">

                        <div className="formgrid grid">
                        <div className="field col">
                                <select >
                                <label >Type de Réclamation:</label>
                                    <option value="">Rejet du dossier de prêt</option>
                                    <option value="1">Réclamation liée au remboursement</option>
                                    <option value="2">Qualité de service en agence</option>
                                    <option value="3">Tarification</option>
                                    <option value="4">Autres</option>
                                </select>
                            </div>
                        </div>
                        <div className="formgrid grid">
                        <div className="field col">
                                <select>
                                <label >Canal de Traitement:</label>
                                    <option value="grapefruit"> Au niveau local</option>
                                    <option value="lime"> Au niveau central</option>
                            
                                </select>
                            </div>
                        </div>
                        <div className="formgrid grid">
                        <div className="field col">
                                <select>
                                <label >Canal de Communication:</label>
                                  <option value="">Courrier postal</option>
                                  <option value="1">Site internet</option>
                                  <option value="2">Courrier électronique</option>
                                  <option value="3">Téléphone</option>
                                  <option value="4">Voie Orale</option>
                                </select>
                            </div>
                        </div>

                        </div>

                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && <span>Are you sure you want to delete <b>{product.name}</b>?</span>}
                        </div>
                    </Dialog> */}
                </div>
            </div>
        </div>
    );
};

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Crud, comparisonFn);
