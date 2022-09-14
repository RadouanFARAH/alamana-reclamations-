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
import { Dropdown } from "primereact/dropdown";
import { Messages } from 'primereact/messages';
import { Message } from 'primereact/message';

import moment from "moment";

import { AgenceService } from "../service/AgenceService";

const Crud = () => {
    let emptyProduct = {
        id: "",
        nom: "",
        prenom: "",
        cin: "",
        adress: "",
        tiers: "",
        telephone: "",
        type: null,
        communication: "",
        traitement: "",
        etat: "",
        date_reception: "",
        user_id: "",
        client: "",
        calification: "",
        description: "",
        sous_type: "",
        file: ""
    };

    const [fileData, setFileData] = useState(null);


    const [products, setProducts] = useState(null);


    const [type, setType] = useState("");
    const [type1, setType1] = useState("");
    const [type2, setType2] = useState("");
    const [selectedCity1, setSelectedCity1] = useState(null);
    const [agences, setAgences] = useState(null);

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
        reclamationService.getReclamations().then((data) => {
            // console.log(data.message);
            setProducts(data.message);
        });
        const agenceService = new AgenceService();
        agenceService.getAgence().then((data) => {
            // console.log(data);
            setAgences(data.message);
        });
    }, []);

    const formatCurrency = (value) => {
        return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
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

    const hideDetailProductDialog = () => {
        setSubmitted(false);
        setProductDialog2(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);

        if (product.nom.trim() && product.prenom.trim() && product.cin.trim() && product.tiers.trim() && product.adress.trim() && product.telephone.trim() && product.client && product.calification.trim() && product.description.trim() && product.type && product.sous_type && product.traitement.trim() && product.communication.trim() && product.prenom.trim()) {
            let _products = [...products];
            let _product = { ...product };
            if (product.id) {
                const reclamationService = new ReclamationService();

                const formData = new FormData();

                formData.append('id', product.id)
                formData.append('nom', product.nom)
                formData.append('prenom', product.prenom)
                formData.append('cin', product.cin)
                formData.append('adress', product.adress)
                formData.append('tiers', product.tiers)
                formData.append('telephone', product.telephone)
                formData.append('type', product.type)
                formData.append('communication', product.communication)
                formData.append('traitement', product.traitement)
                formData.append('etat', product.etat)
                formData.append('date_reception', product.date_reception)
                formData.append('user_id', product.user_id)
                formData.append('client', product.client)
                formData.append('calification', product.calification)
                formData.append('description', product.description)
                formData.append('sous_type', product.sous_type)
                formData.append('file', product.file)

                reclamationService.putReclamations(formData).then((data) => {
                    if (!data.error) {
                        reclamationService.getReclamations().then((data) => setProducts(data?.message));
                        toast.current.show({ severity: "success", summary: "Succès ", detail: "Réclamation Modifier", life: 3000 });
                    } else {
                        toast.current.show({ severity: "error", summary: "Erreur ", detail: "Réclamation non Modifier", life: 3000 });
                    }
                });
            } else {
                const reclamationService = new ReclamationService();
                const formData = new FormData();

                formData.append('id', product.id)
                formData.append('nom', product.nom)
                formData.append('prenom', product.prenom)
                formData.append('cin', product.cin)
                formData.append('adress', product.adress)
                formData.append('tiers', product.tiers)
                formData.append('telephone', product.telephone)
                formData.append('type', product.type)
                formData.append('communication', product.communication)
                formData.append('traitement', product.traitement)
                formData.append('etat', product.etat)
                formData.append('date_reception', product.date_reception)
                formData.append('user_id', product.user_id)
                formData.append('client', product.client)
                formData.append('calification', product.calification)
                formData.append('description', product.description)
                formData.append('sous_type', product.sous_type)
                formData.append('file', product.file)

                reclamationService.postReclamations(formData).then((data) => {
                    if (!data.error) {
                        reclamationService.getReclamations().then((data) => setProducts(data?.message));
                        toast.current.show({ severity: "success", summary: "Succès ", detail: "Réclamation Créer", life: 3000 });
                    } else {
                        toast.current.show({ severity: "error", summary: "Erreur ", detail: "Réclamation non Créer", life: 3000 });
                    }
                });
            }

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

    const searchClient = () => {
        let inputt = {
            cin: product.cin,
            codeGest: "004",
        };
        const reclamationService = new ReclamationService();
        reclamationService.getInfosClient(inputt).then((data) => {
            if (!data.error) {
                toast.current.show({ severity: "success", summary: "Succès ", detail: "Client d'Alamana", life: 3000 });
                let foundProduct = {
                    id: "",
                    nom: data.message.nom,
                    prenom: data.message.prenom,
                    cin: data.message.cin,
                    adress: data.message.habita + " " + data.message.rue + " " + data.message.quartier,
                    tiers: data.message.numTier,
                    telephone: data.message.gsm,
                    type: null,
                    communication: "",
                    traitement: "",
                    etat: "",
                    date_reception: "",
                    user_id: "",
                    client: "",
                    calification: "",
                    description: "",
                    sous_type: "",
                    file: ""
                };
                setProduct(foundProduct);
            } else {
                toast.current.show({ severity: "error", summary: "Erreur ", detail: "La personne n'est pas client", life: 3000 });
            }
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
    const onInputTypeChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _product = { ...product };
        _product[`${name}`] = val;
        _product[`sous_type`] = null;
        setProduct(_product);
    };
    const onInputFileChange = (e) => {
        const val = e.target.files[0];

        let _product = { ...product };
        if (val?.size > 10240000) {
            _product[`file`] = null;
            e.target.value = "";

            toast.current.show({ severity: "error", summary: "Erreur", detail: "Le fichier dépasse la taille maximale de 10 mb", life: 3000 });
        } else {
            _product[`file`] = val;
        }
        setProduct(_product);
    };
    const onInputDelaiChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        if (!isNaN(val)) {
            let _product = { ...product };
            _product[`${name}`] = val;
            setProduct(_product);
        } else {
            toast.current.show({ severity: "warn", summary: "Attention!", detail: "Le délai doit être un nombre", life: 3000 });
        }
    };
    const onInputTiersChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        if (val.length <= 11) {
            let _product = { ...product };
            _product[`${name}`] = val;
            setProduct(_product);
        } else {
            toast.current.show({ severity: "warn", summary: "Attention!", detail: "Le numero de tiers doit contenir 11 caractères", life: 3000 });
        }
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
                <Button label="Exporter" type="button" icon="pi pi-file-excel" onClick={exportExcel} className="p-button-help " data-pr-tooltip="XLS" />
                {/* <Button label="Exporter" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} /> */}
            </React.Fragment>
        );
    };

    const codeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">id</span>

                {rowData.id < 10 && "000" + rowData.id}
                {rowData.id < 100 && rowData.id >= 10 && "00" + rowData.id}
                {rowData.id < 1000 && rowData.id >= 100 && "0" + rowData.id}
                {rowData.id >= 1000 && rowData.id}
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

    const actionBodyTemplate = (rowData) => {
        return <div className="actions">{rowData?.etat == "Non affecter" && <Button icon="pi pi-pencil" label="Modifier" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} />}</div>;
    };
    const actionBodyTemplate2 = (rowData) => {
        return <Button icon="pi pi-eye" className="p-button-rounded p-button-danger mr-2" onClick={() => detailProduct(rowData)} />;
    };
    const dateBodyTemplate = (rowData) => {
        return <div>{moment(rowData?.date_reception).format("YYYY/MM/DD")}</div>;
    };
    const fileBodyTemplate = (rowData) => {

        if (!rowData.file) {
            return <span></span>;
        } else {

            return <Button
                icon="pi pi-download"
                className="p-button-rounded p-button-secondary mt-2 "
                onClick={(e) => {
                    const reclamationService = new ReclamationService();
                    reclamationService.getReclamationFile(rowData).then((res) => {
                        import("file-saver").then((module) => {
                            if (module && module.default) {
                                module.default.saveAs(res);
                            }
                        });
                    });
                }}
                aria-haspopup
                aria-controls="overlay_panel"
            />
        }


    };

    const typeSelectItems0 = [
        { label: "Réclamation", value: "Réclamation" },
        { label: "Demande", value: "Demande" },
    ];
    const typeSelectItems = [
        { label: "Processus de Gestion des Prêts", value: "Processus de Gestion des Prêts" },
        { label: "Processus d’Octroi des prêts", value: "Processus d’Octroi des prêts" },
        { label: "Tarification", value: "Tarification" },
        { label: "Respect d'Ethique", value: "Respect d'Ethique" },
        { label: "Veille Juridique", value: "Veille Juridique" },
        { label: "Fraudes et corruptions", value: "Fraudes et corruptions" },
        { label: "Autres", value: "Autres" },
    ];
    const typeSelectItems1 = [
        { label: " Courrier postal ", value: " Courrier postal" },
        { label: "Site internet", value: "Site internet" },
        { label: "Courrier électronique", value: "Courrier électronique" },
        { label: "Téléphone", value: "Téléphone" },
        { label: "Voie Orale", value: "Voie Orale" },
    ];
    const typeSelectItems2 = [
        { label: "Au niveau local", value: "Au niveau local" },
        { label: "Au niveau central", value: "Au niveau central" },
    ];
    const sousTypePGP = [
        { label: "Réclamation liée au remboursement", value: "Réclamation liée au remboursement" },
        { label: "Recouvrement à l’amiable", value: "Recouvrement à l’amiable" },
        { label: "Recouvrement contentieux", value: "Recouvrement contentieux" },
        { label: "Mainlevée", value: "Mainlevée" },
    ];
    const sousTypePOP = [
        { label: "Accueil", value: "Accueil" },
        { label: "Rejet de la demande de prêt", value: "Rejet de la demande de prêt" },
        { label: "Demande de consolidation ", value: "Demande de consolidation " },
        { label: "Délai de traitement d'une demande de crédit", value: "Délai de traitement d'une demande de crédit" },
        { label: "Crédit bureau / Centrale des risques", value: "Crédit bureau / Centrale des risques" },
        { label: "Demandes particulières non exécutées au niveau du réseau", value: "Demandes particulières non exécutées au niveau du réseau" },
    ];
    const sousTypeT = [{ label: "Tarification", value: "Tarification" }];
    const sousTypeRE = [{ label: "Respect d’Ethique", value: "Respect d’Ethique" }];
    const sousTypeVJ = [{ label: "Veille juridique", value: "Veille juridique" }];
    const sousTypeFC = [{ label: "Fraudes et corruptions", value: "Fraudes et corruptions" }];
    const sousTypeA = [{ label: "Autres cas d’insatisfaction", value: "Autres cas d’insatisfaction" }];

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Mes Réclamation</h5>
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

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={products}
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
                        {/* <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column> */}
                        <Column body={actionBodyTemplate2}></Column>
                        <Column field="id" header="Id" sortable body={codeBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="nom" header="Nom" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="prenom" header="Prénom" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="cin" header="Cin" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="tiers" header="N° tiers" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="adress" header="Adress" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="telephone" header="Téléphone" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="client" header="Client" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="calification" header="calification" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        {/* <Column field="description" header="description" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column> */}
                        <Column field="type" header="Type" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="sous_type" header="sous type" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="traitement" header="Canal de Traitement" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="communication" header="Canal de Communication" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="date_reception" header="Date réception" sortable body={dateBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="file" header="Fichier" sortable body={fileBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="etat" header="État" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: "980px" }} header="Détails Réclamation" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="cin">Cin</label>
                                <InputText id="cin" value={product.cin} onChange={(e) => onInputChange(e, "cin")} required className={classNames({ "p-invalid": submitted && !product.cin })} />
                                {submitted && !product.cin && <small className="p-invalid">Cin est obligatoire.</small>}
                            </div>
                            <div className="field col">
                                <label htmlFor="cin">_</label>
                                <Button label="Rechercher" type="button" icon="pi pi-search" onClick={searchClient} className="p-button-help " data-pr-tooltip="XLS" />
                                {/* <Button label="Exporter" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} /> */}
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="nom">Nom</label>
                                <InputText id="nom" value={product.nom} onChange={(e) => onInputChange(e, "nom")} required autoFocus className={classNames({ "p-invalid": submitted && !product.nom })} />
                                {submitted && !product.nom && <small className="p-invalid">Nom est obligatoire.</small>}
                            </div>
                            <div className="field col">
                                <label htmlFor="prenom">Prénom</label>
                                <InputText id="prenom" value={product.prenom} onChange={(e) => onInputChange(e, "prenom")} required className={classNames({ "p-invalid": submitted && !product.prenom })} />
                                {submitted && !product.prenom && <small className="p-invalid">Prénom est obligatoire.</small>}
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="description">description</label>
                                <InputText id="description" value={product.description} onChange={(e) => onInputChange(e, "description")} required className={classNames({ "p-invalid": submitted && !product.description })} />
                                {submitted && !product.description && <small className="p-invalid">description est obligatoire.</small>}
                            </div>
                            <div className="field col">
                                <label htmlFor="client">client</label>
                                <InputText id="client" value={product.client} onChange={(e) => onInputChange(e, "client")} required className={classNames({ "p-invalid": submitted && !product.client })} />
                                {submitted && !product.client && <small className="p-invalid">client est obligatoire.</small>}
                            </div>

                        </div>

                        <div className="formgrid grid">

                            {/* <div className="field col">
                                <label htmlFor="cin">Cin</label>
                                <InputText id="cin" value={product.cin} onChange={(e) => onInputChange(e, "cin")} required className={classNames({ "p-invalid": submitted && !product.cin })} />
                                {submitted && !product.cin && <small className="p-invalid">Cin est obligatoire.</small>}
                            </div> */}

                            <div className="field col">
                                <label htmlFor="adress">Adresse</label>
                                <InputText id="adress" value={product.adress} onChange={(e) => onInputChange(e, "adress")} required className={classNames({ "p-invalid": submitted && !product.adress })} />
                                {submitted && !product.adress && <small className="p-invalid">l'Adress est obligatoire.</small>}
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="tiers">N° tiers</label>
                                <InputText id="tiers" value={product.tiers} onChange={(e) => onInputTiersChange(e, "tiers")} required className={classNames({ "p-invalid": submitted && !product.tiers })} />
                                {submitted && !product.tiers && <small className="p-invalid">N° tiers est obligatoire.</small>}
                            </div>

                            <div className="field col">
                                <label htmlFor="telephone">Téléphone</label>
                                <InputText id="telephone" value={product.telephone} onChange={(e) => onInputChange(e, "telephone")} required className={classNames({ "p-invalid": submitted && !product.telephone })} />
                                {submitted && !product.telephone && <small className="p-invalid">Téléphone est obligatoire.</small>}
                            </div>









                            <div className="field col">
                                <label htmlFor="file">Fichier</label>
                                <InputText type="file" id="file" onChange={(e) => onInputFileChange(e)} required className={classNames({ "p-invalid": submitted && !product.file })} />
                            </div>
















                        </div>

                        <div className="formgrid grid">
                            <div className="field col" >
                                <label htmlFor="type">Type Réclamation</label>
                                <Dropdown id="type" value={product.type} options={typeSelectItems} onChange={(e) => onInputTypeChange(e, "type")} placeholder="Type de Réclamation" className={classNames({ "p-invalid": submitted && !product.type })} />
                                {submitted && !product.type && <small className="p-invalid">Type Réclamation est obligatoire.</small>}
                            </div>
                            {product.type === "Processus de Gestion des Prêts" && (
                                <div className="field col" >
                                    <label htmlFor="sous_type">Sous type réclamation</label>
                                    <Dropdown id="sous_type" value={product.sous_type} options={sousTypePGP} onChange={(e) => onInputChange(e, "sous_type")} placeholder="sous type" className={classNames({ "p-invalid": submitted && !product.sous_type })} />
                                    {submitted && !product.sous_type && <small className="p-invalid">Sous type réclamation est obligatoire.</small>}
                                </div>
                            )}
                            {product.type === "Processus d’Octroi des prêts" && (
                                <div className="field col" >
                                    <label htmlFor="sous_type">Sous type réclamation</label>
                                    <Dropdown id="sous_type" value={product.sous_type} options={sousTypePOP} onChange={(e) => onInputChange(e, "sous_type")} placeholder="sous type" className={classNames({ "p-invalid": submitted && !product.sous_type })} />
                                    {submitted && !product.sous_type && <small className="p-invalid">Sous type réclamation est obligatoire.</small>}
                                </div>
                            )}
                            {product.type === "Tarification" && (

                                <div className="field col" >
                                    <label htmlFor="sous_type">Sous type réclamation</label>
                                    <Dropdown id="sous_type" value={product.sous_type} options={sousTypeT} onChange={(e) => onInputChange(e, "sous_type")} placeholder="sous type" className={classNames({ "p-invalid": submitted && !product.sous_type })} />
                                    {submitted && !product.sous_type && <small className="p-invalid">Sous type réclamation est obligatoire.</small>}
                                </div>

                            )}
                            {product.type === "Respect d'Ethique" && (

                                <div className="field col" >
                                    <label htmlFor="sous_type">Sous type réclamation</label>
                                    <Dropdown id="sous_type" value={product.sous_type} options={sousTypeRE} onChange={(e) => onInputChange(e, "sous_type")} placeholder="sous type" className={classNames({ "p-invalid": submitted && !product.sous_type })} />
                                    {submitted && !product.sous_type && <small className="p-invalid">Sous type réclamation est obligatoire.</small>}
                                </div>
                            )}
                            {product.type === "Veille Juridique" && (
                                <div className="field col" >
                                    <label htmlFor="sous_type">Sous type réclamation</label>
                                    <Dropdown id="sous_type" value={product.sous_type} options={sousTypeVJ} onChange={(e) => onInputChange(e, "sous_type")} placeholder="sous type" className={classNames({ "p-invalid": submitted && !product.sous_type })} />
                                    {submitted && !product.sous_type && <small className="p-invalid">Sous type réclamation est obligatoire.</small>}
                                </div>
                            )}
                            {product.type === "Fraudes et corruptions" && (
                                <div className="field col" >
                                    <label htmlFor="sous_type">Sous type réclamation</label>
                                    <Dropdown id="sous_type" value={product.sous_type} options={sousTypeFC} onChange={(e) => onInputChange(e, "sous_type")} placeholder="sous type" className={classNames({ "p-invalid": submitted && !product.sous_type })} />
                                    {submitted && !product.sous_type && <small className="p-invalid">Sous type réclamation est obligatoire.</small>}
                                </div>
                            )}
                            {product.type === "Autres" && (
                                <div className="field col">
                                    <label htmlFor="sous_type">Sous type réclamation</label>
                                    <Dropdown id="sous_type" value={product.sous_type} options={sousTypeA} onChange={(e) => onInputChange(e, "sous_type")} placeholder="sous type" className={classNames({ "p-invalid": submitted && !product.sous_type })} />
                                    {submitted && !product.sous_type && <small className="p-invalid">Sous type réclamation est obligatoire.</small>}
                                </div>
                            )}
                        </div>

                        <div className="formgrid grid">
                            <div className="field col" >
                                <label htmlFor="calification">Calification</label>
                                <Dropdown id="calification" value={product.calification} options={typeSelectItems0} onChange={(e) => onInputChange(e, "calification")} placeholder="Calification" className={classNames({ "p-invalid": submitted && !product.calification })} />
                                {submitted && !product.calification && <small className="p-invalid">Calification est obligatoire.</small>}
                            </div>

                            <div className="field col" >
                                <label htmlFor="communication">Canal de Communication</label>
                                <Dropdown id="communication" value={product.communication} options={typeSelectItems1} onChange={(e) => onInputChange(e, "communication")} placeholder="Canal de Communication" className={classNames({ "p-invalid": submitted && !product.communication })} />
                                {submitted && !product.communication && <small className="p-invalid">Canal de Communication est obligatoire.</small>}
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col" >
                                <label htmlFor="traitement">Canal de Traitement</label>
                                <Dropdown id="traitement" value={product.traitement} options={typeSelectItems2} onChange={(e) => onInputChange(e, "traitement")} placeholder="Canal de Traitement" className={classNames({ "p-invalid": submitted && !product.traitement })} />
                                {submitted && !product.traitement && <small className="p-invalid">Canal de Traitement est obligatoire.</small>}
                            </div>
                        </div>
                    </Dialog>

                    <Dialog visible={productDialog2} style={{ width: "900px" }} modal className="p-fluid" onHide={hideDetailProductDialog}>
                        <h5><b style={{ color: "black" }}>Détails Réclamation :</b>   </h5>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="id"   ><b>Id :</b>  </label>
                                <p> {product.id < 10 && "000" + product.id}
                                    {product.id < 100 && product.id >= 10 && "00" + product.id}
                                    {product.id < 1000 && product.id >= 100 && "0" + product.id}
                                    {product.id >= 1000 && product.id}</p>

                            </div>
                            <div className="field col">
                                <label htmlFor="calification"   ><b>Calification :</b> </label>
                                <p>{(product.calification)}</p>
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col" >
                                <label htmlFor="reception"   ><b>Date reception</b> :</label>
                                <div>{moment(product?.date_reception).format("YYYY/MM/DD")}</div>
                            </div>
                            <div className="field col">
                                <label htmlFor="etat"   ><b>Etat :</b></label>
                                <p>{(product.etat)}</p>
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col" >
                                <label htmlFor="traitement"   ><b>Canal de traitement :</b></label>
                                <p>{(product.traitement)}</p>
                            </div>
                            <div className="field col">
                                <label htmlFor="communication"   ><b>Canal de communication :</b></label>
                                <p>{(product.communication)}</p>
                            </div>
                        </div>


                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="type"   ><b>Type de réclamation :</b></label>
                                <p>{(product.type)}</p>
                            </div>
                            <div className="field col">
                                <label htmlFor="sous-type"   ><b>Sous type :</b></label>
                                <p>{(product.sous_type)}</p>
                            </div>

                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="description"   ><b>Description :</b></label>
                                <p>{(product.description)}</p>
                            </div>
                        </div>
                        <hr></hr>
                        <h5><b style={{ color: "black" }}>Détails Client : </b>{(product.client)}</h5>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="nom"   ><b>Nom :</b>  </label>
                                <p>{(product.nom)}</p>
                            </div>
                            <div className="field col">
                                <label htmlFor="prenom"   ><b>Prénom :</b> </label>
                                <p>{(product.prenom)}</p>
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="cin"   ><b>Cin :</b>  </label>
                                <p>{(product.cin)}</p>
                            </div>
                            <div className="field col">
                                <label htmlFor="tiers"   ><b>N°tiers :</b> </label>
                                <p>{(product.tiers)}</p>
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="adress"   ><b>Adresse :</b>  </label>
                                <p>{(product.nom)}</p>
                            </div>
                            <div className="field col">
                                <label htmlFor="telephone"><b>Téléphone :</b> </label>
                                <p>{(product.telephone)}</p>
                            </div>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {product && (
                                <span>
                                    Are you sure you want to delete <b>{product.name}</b>?
                                </span>
                            )}
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
