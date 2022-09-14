const config = require("../dbconfig");
const express = require("express");
const { verifyToken } = require("../middleware/auth");
const router = express.Router();
const mysql = require("mysql2/promise");

  router.get("/", verifyToken, async (request, response) => {
    userId = request.user.id;
    try {
      const connection = await mysql.createConnection(config);
      const [userInfo,fields] = await connection.execute("SELECT * from user where id=?",[userId])
        
      let user = userInfo[0];
  
      console.log(user);
  
      let dashboardData = {
        reclamationTotal: 0,
        traitementTotal: 0,
        cloturationTotal: 0,
        agenceTotal: 0,
        siegeTotal: 0,
        userTotal: 0,


        reclamationMois: 0,
        traitementMois: 0,
        cloturationMois: 0,
        agenceMois: 0,
        siegeMois: 0,
        userMois: 0,

        users: [],
        sieges: [],
        agences: [],
        reclamations: [],
        traitements: [],
        cloturations: [],



        lineReclamations: {
          labels: [
            "Janvier",
            "Février",
            "Mars",
            "Avril",
            "Mai",
            "Juin",
            "Juillet",
            "Août",
            "Septembre",
            "Octobre",
            "Novembre",
            "Décembre",
          ],
          datasets: [
            {
              label: "Réclamations",
              data: [],
              fill: false,
              backgroundColor: "#0275d8",
              borderColor: "#0275d8",
              tension: 0.4,
            },
          ],
        },
        lineTraitements: {
          labels: [
            "Janvier",
            "Février",
            "Mars",
            "Avril",
            "Mai",
            "Juin",
            "Juillet",
            "Août",
            "Septembre",
            "Octobre",
            "Novembre",
            "Décembre",
          ],
          datasets: [
            {
              label: "Traitements",
              data: [],
              fill: false,
              backgroundColor: "#F73535",
              borderColor: "#F73535",
              tension: 0.4,
            },
          ],
        },
        lineCloturations: {
          labels: [
            "Janvier",
            "Février",
            "Mars",
            "Avril",
            "Mai",
            "Juin",
            "Juillet",
            "Août",
            "Septembre",
            "Octobre",
            "Novembre",
            "Décembre",
          ],
          datasets: [
            {
              label: "Cloturations",
              data: [],
              fill: false,
              backgroundColor: "#4CAB80",
              borderColor: "#4CAB80",
              tension: 0.4,
            },
          ],
        },
        lineAgence: {
          labels: [
            "Janvier",
            "Février",
            "Mars",
            "Avril",
            "Mai",
            "Juin",
            "Juillet",
            "Août",
            "Septembre",
            "Octobre",
            "Novembre",
            "Décembre",
          ],
          datasets: [
            {
              label: "Agences",
              data: [],
              fill: false,
              backgroundColor: "#0275d8",
              borderColor: "#0275d8",
              tension: 0.4,
            },
          ],
        },
        lineSiege: {
          labels: [
            "Janvier",
            "Février",
            "Mars",
            "Avril",
            "Mai",
            "Juin",
            "Juillet",
            "Août",
            "Septembre",
            "Octobre",
            "Novembre",
            "Décembre",
          ],
          datasets: [
            {
              label: "Sieges",
              data: [],
              fill: false,
              backgroundColor: "#df4759",
              borderColor: "#df4759",
              tension: 0.4,
            },
          ],
        },
        lineUtilisateur: {
          labels: [
            "Janvier",
            "Février",
            "Mars",
            "Avril",
            "Mai",
            "Juin",
            "Juillet",
            "Août",
            "Septembre",
            "Octobre",
            "Novembre",
            "Décembre",
          ],
          datasets: [
            {
              label: "Utilisateurs",
              data: [],
              fill: false,
              backgroundColor: "#5cb85c",
              borderColor: "#5cb85c",
              tension: 0.4,
            },
          ],
        },
      };
  

      if (user.role==="gr") {
        


        const sqlGet1 = "SELECT count(id) nbrMR from reclamation where user_id=?  ";      
        const [rows1, fields1] = await connection.execute(sqlGet1,[user.id]);
        dashboardData.reclamationTotal=rows1[0].nbrMR

        const sqlGet2 = "SELECT count(date_traitement) nbrMT from traitement where user_id=? AND date_traitement IS NOT NULL";      
        const [rows2, fields2] = await connection.execute(sqlGet2, [user.id]);
        dashboardData.traitementTotal=rows2[0].nbrMT

        const sqlGet3 = "SELECT count(id) nbrMC from reclamation where etat=?  ";      
        const [rows3, fields3] = await connection.execute(sqlGet3,["cloturer"]);
        dashboardData.cloturationTotal=rows3[0].nbrMC


        const month = new Date().getMonth()+1;
        const year = new Date().getFullYear();

        const sqlGet = "SELECT  count(id) as nbrR from reclamation where YEAR(date_reception)=? and MONTH(date_reception)=? and user_id=?  group by (user_id)";       
        const [rows, fields] = await connection.execute(sqlGet,[year,month,user.id]);
        console.log(rows)
        dashboardData.reclamationMois=rows[0]?.nbrR

        const sqlGet4 = "SELECT  count(id) as nbrMT from traitement where YEAR(date_traitement)=? and MONTH(date_traitement)=? and user_id=?  "; 
        const [rows4, fields4] = await connection.execute(sqlGet4,[year,month,user.id]);
        dashboardData.traitementMois=rows4[0]?.nbrMT
    
        const sqlGet5 = "SELECT  count(id) as nbrMC from traitement where YEAR(date_cloturation)=? and MONTH(date_cloturation)=?  ";     
        const [rows5, fields5] = await connection.execute(sqlGet5,[year,month]);
        dashboardData.cloturationMois=rows5[0]?.nbrMC








        const sqlGet6 = "SELECT * from reclamation where user_id=? order by date_reception desc limit 5  ";      
        const [rows6, fields6] = await connection.execute(sqlGet6,[user.id]);
        dashboardData.reclamations=rows6

        const traiterGet = "SELECT * from traitement where user_id=? order by date_affectation desc limit 6";
      const [rows7, fields7] = await connection.execute(traiterGet, [user.id]);
  
      const traitements = new Array();
      for (let i = 0; i < rows7.length; i++) {
        const traitement = rows7[i];
        const reclamationGet = "select * from reclamation where id=? and etat=?";
        const [rows1, fields1] = await connection.execute(reclamationGet, [
          traitement.reclamation_id,
          "Non traiter",
        ]);
        if (rows1[0]?.etat === "Non traiter") {
          traitement.reclamation_id = rows1[0];
          const userGet = "select * from user where id=? ";
          const [rows2, fields2] = await connection.execute(userGet, [
            traitement?.reclamation_id?.user_id,
          ]);
          traitement.reclamation_id.user_id = rows2[0];
          traitements.push(traitement);
        }
      }
      dashboardData.traitements=traitements
 

      const sqlGetC = "SELECT * from reclamation where etat=? order by date_reception desc limit 5  ";      
      const [rowsC, fieldsC] = await connection.execute(sqlGetC,["Non cloturer"]);
      dashboardData.cloturations=rowsC

      let i = 1;
  
      while (i <= month) {
        const sqlGet = "SELECT  count(id) as nbrR from reclamation where YEAR(date_reception)=? and MONTH(date_reception)=? and user_id=? ";       
        const [rows, fields] = await connection.execute(sqlGet,[year,i,user.id]);

        const sqlGet4 = "SELECT  count(id) as nbrMT from traitement where YEAR(date_traitement)=? and MONTH(date_traitement)=? and user_id=?  "; 
        const [rows4, fields4] = await connection.execute(sqlGet4,[year,i,user.id]);
    
        const sqlGet5 = "SELECT  count(id) as nbrMC from traitement where YEAR(date_cloturation)=? and MONTH(date_cloturation)=? and user_id=? ";     
        const [rows5, fields5] = await connection.execute(sqlGet5,[year,i,user.id]);


        dashboardData.lineReclamations.datasets[0].data.push(rows[0].nbrR);
        dashboardData.lineTraitements.datasets[0].data.push(rows4[0].nbrMT);
        dashboardData.lineCloturations.datasets[0].data.push(rows5[0].nbrMC);
        
  
        i++;
      }
      }else if (user.role==="cc" || user.role==="ac" ) {
        


        const sqlGet1 = "SELECT count(id) nbrMR from reclamation where user_id=?  ";      
        const [rows1, fields1] = await connection.execute(sqlGet1,[user.id]);
        dashboardData.reclamationTotal=rows1[0]?.nbrMR


        const month = new Date().getMonth()+1;
        const year = new Date().getFullYear();

        const sqlGet = "SELECT  count(id) as nbrR from reclamation where YEAR(date_reception)=? and MONTH(date_reception)=? and user_id=?  group by (user_id)";       
        const [rows, fields] = await connection.execute(sqlGet,[year,month,user.id]);
        console.log(rows)
        dashboardData.reclamationMois=rows[0]?.nbrR


      



        const sqlGet6 = "SELECT * from reclamation where user_id=? order by date_reception desc limit 5  ";      
        const [rows6, fields6] = await connection.execute(sqlGet6,[user.id]);
        dashboardData.reclamations=rows6


      let i = 1;
  
      while (i <= month) {
        const sqlGet = "SELECT  count(id) as nbrR from reclamation where YEAR(date_reception)=? and MONTH(date_reception)=? and user_id=? ";       
        const [rows, fields] = await connection.execute(sqlGet,[year,i,user.id]);


        dashboardData.lineReclamations.datasets[0].data.push(rows[0].nbrR);


  
        i++;
      }
      }else if (user.role==="admin") {

            //obtenir  agence
            const sqlGet7 = "SELECT count(id) nbrA from agence ";      
            const [rows7, fields7] = await connection.execute(sqlGet7);
 
            dashboardData.agenceTotal=rows7[0].nbrA

            //obtenir  jf
            const sqlGet8 = "SELECT count(id) nbrS from joursferies";      
            const [rows8, fields8] = await connection.execute(sqlGet8);
            
            dashboardData.siegeTotal=rows8[0].nbrS

            //obtenir  utilisateur
            const sqlGet9 = "SELECT count(id) nbrU from user ";      
            const [rows9, fields9] = await connection.execute(sqlGet9);

            dashboardData.userTotal=rows9[0].nbrU





        const month = new Date().getMonth()+1;
        const year = new Date().getFullYear();


        //obtenir  agence
        const sqlGet6 = "SELECT  count(id) as nbrA from agence where YEAR(date_creation)=? and MONTH(date_creation)=? ";      
        const [rows6, fields6] = await connection.execute(sqlGet6,[year,month]);
        
        dashboardData.agenceMois=rows6[0].nbrA

        //obtenir  jf
        const sqlGet10 = "SELECT  count(id) as nbrS from joursferies where YEAR(date_debut)=? and MONTH(date_debut)=? ";      
        const [rows10, fields10] = await connection.execute(sqlGet10,[year,month]);  
        dashboardData.siegeMois=rows10[0].nbrS

        //obtenir  utilisateur
        const sqlGet11 = "SELECT  count(id) as nbrU from user where YEAR(date_inscription)=? and MONTH(date_inscription)=? ";      
        const [rows11, fields11] = await connection.execute(sqlGet11,[year,month]);

        dashboardData.userMois=rows11[0].nbrU
    



  
        

      // obtenir agence
      const sqlGet0 = "SELECT * from agence order by id desc limit 5";      
      const [rows0, fields0] = await connection.execute(sqlGet0);
      dashboardData.agences=rows0

      // obtenir sieges
      const sqlGet12 = "SELECT * from joursferies order by id desc limit 5";      
      const [rows12, fields12] = await connection.execute( sqlGet12);
      dashboardData.sieges=rows12

      // obtenir utilisateur
      const sqlGet13 = "SELECT * from user order by date_inscription desc limit 5";      
      const [rows13, fields13] = await connection.execute(sqlGet13);
      dashboardData.users=rows13



      let i = 1;
  
      while (i <= month) {


                //obtenir  agence
                const sqlGet6 = "SELECT  count(id) as nbrA from agence where YEAR(date_creation)=? and MONTH(date_creation)=? ";      
                const [rows6, fields6] = await connection.execute(sqlGet6,[year,i]);
                
                dashboardData.agenceMois=rows6[0].nbrA
        
                //obtenir  siege
                const sqlGet10 = "SELECT  count(id) as nbrS from joursferies where YEAR(date_debut)=? and MONTH(date_debut)=? ";      
                const [rows10, fields10] = await connection.execute(sqlGet10,[year,i]);  
                dashboardData.siegeMois=rows10[0].nbrS
        
                //obtenir  utilisateur
                const sqlGet11 = "SELECT  count(id) as nbrU from user where YEAR(date_inscription)=? and MONTH(date_inscription)=? ";      
                const [rows11, fields11] = await connection.execute(sqlGet11,[year,i]);

        dashboardData.lineAgence?.datasets[0]?.data.push(rows6[0].nbrA);
        dashboardData.lineSiege?.datasets[0]?.data.push(rows10[0].nbrS);
        dashboardData.lineUtilisateur?.datasets[0]?.data.push(rows11[0].nbrU);
  
        i++;
      }
      }else if (user.role==="cd") {



      //les reclamation
      const sqlGet = "SELECT count(id) nbrR from reclamation   ";      
      const [rows, fields] = await connection.execute(sqlGet,[user.id]);
      dashboardData.reclamationTotal=rows[0].nbrR

      //traiterCD obtenir tous les reclamations traiter(chef depart)
      const sqlGet2 = "SELECT count(id) nbrT from traitement where  date_traitement IS NOT NULL ";      
      const [rows2, fields2] = await connection.execute(sqlGet2,[user.id]);
      dashboardData.traitementTotal=rows2[0].nbrT

      //cloturerCD obtenir tous les reclamations cloturer(chef depart)
      const sqlGet3 = "SELECT count(id) nbrC from traitement where  date_cloturation IS NOT NULL";      
      const [rows3, fields3] = await connection.execute(sqlGet3,[user.id]);
      dashboardData.cloturationTotal=rows3[0].nbrC





//mois
        const month = new Date().getMonth()+1;
        const year = new Date().getFullYear();
    //obtenir les rec
    const sqlGet4 = "SELECT  count(id) as nbrR from reclamation where YEAR(date_reception)=? and MONTH(date_reception)=?  "; 
    const [rows4, fields4] = await connection.execute(sqlGet4,[year,month]);

    dashboardData.reclamationMois=rows4[0].nbrR

    //obtenir tous les reclamations traiter(chef depart)
    const sqlGet1 = "SELECT  count(id) as nbrT from traitement where YEAR(date_traitement)=? and MONTH(date_traitement)=? AND date_traitement IS NOT NULL ";           
    const [rows1, fields1] = await connection.execute(sqlGet1,[year,month]);

    dashboardData.traitementMois=rows1[0].nbrT

    //obtenir tous les reclamations cloturer(chef depart)
    const sqlGet5 = "SELECT  count(id) as nbrC from traitement where YEAR(date_cloturation)=? and MONTH(date_cloturation)=? and date_cloturation IS NOT NULL ";         
    const [rows5, fields5] = await connection.execute(sqlGet5,[year,month]);

    dashboardData.cloturationMois=rows5[0].nbrC
    



  
        
//tableau


      //les reclamation

      const sqlGet6 = "SELECT * from reclamation order by date_reception desc limit 5 ";      
      const [rows6, fields6] = await connection.execute(sqlGet6);
      dashboardData.reclamations=rows6

      // obtenir 5  reclamations traiter(chef depart)
      const sqlGet9 = "SELECT * from reclamation  where  etat=? order by date_reception desc limit 5";      
      const [rows9, fields9] = await connection.execute( sqlGet9, ["Non cloturer"]);
      dashboardData.traitements=rows9

      //obtenir 5 reclamations cloturer(chef depart)
      const sqlGet8 = "SELECT * from reclamation where  etat=? order by date_reception desc limit 5 ";      
      const [rows8, fields8] = await connection.execute(sqlGet8,["cloturer"]);
      dashboardData.cloturations=rows8

//chart
      let i = 1;
  
      while (i <= month) {

                //obtenir les rec
                const sqlGet4 = "SELECT  count(id) as nbrR from reclamation where YEAR(date_reception)=? and MONTH(date_reception)=?  "; 
                const [rows4, fields4] = await connection.execute(sqlGet4,[year,i]);

                dashboardData.reclamationMois=rows4[0].nbrR

                //obtenir tous les reclamations traiter(chef depart)
                const sqlGet1 = "SELECT  count(id) as nbrT from traitement where YEAR(date_traitement)=? and MONTH(date_traitement)=? AND date_traitement IS NOT NULL ";           
                const [rows1, fields1] = await connection.execute(sqlGet1,[year,i]);

                dashboardData.traitementMois=rows1[0].nbrT

                //obtenir tous les reclamations cloturer(chef depart)
                const sqlGet5 = "SELECT  count(id) as nbrC from traitement where YEAR(date_cloturation)=? and MONTH(date_cloturation)=? and date_cloturation IS NOT NULL ";         
                const [rows5, fields5] = await connection.execute(sqlGet5,[year,i]);

                dashboardData.cloturationMois=rows5[0].nbrC

        dashboardData.lineReclamations?.datasets[0]?.data.push(rows4[0].nbrR);
        dashboardData.lineTraitements?.datasets[0]?.data.push(rows1[0].nbrT);
        dashboardData.lineCloturations?.datasets[0]?.data.push(rows5[0].nbrC);
  
        i++;
      }
      }else if (user.role==="ca" || user.role==="gs"  || user.role==="dr" || user.role==="ds" || user.role==="ec") {


//cart

      //reclamationEC
      const sqlGet10 = "SELECT count(id) nbrEC from traitement where user_id=?  ";      
      const [rows10, fields10] = await connection.execute(sqlGet10,[user.id]);
      dashboardData.reclamationTotal=rows10[0].nbrEC

      //traitement obtenir mes reclamations traiter
      const sqlGet11 = "SELECT count(date_traitement) nbrMT from traitement where user_id=? AND date_traitement IS NOT NULL";      
      const [rows11, fields11] = await connection.execute(sqlGet11, [user.id]);
      dashboardData.traitementTotal=rows11[0].nbrMT




//mois
        const month = new Date().getMonth()+1;
        const year = new Date().getFullYear();


    //obtenir  mes traitement
    const sqlGet5 = "SELECT  count(id) as nbrMT from traitement where YEAR(date_traitement)=? and MONTH(date_traitement)=? and user_id=?  "; 
    const [rows5, fields5] = await connection.execute(sqlGet5,[year,month,user.id]);
    dashboardData.reclamationMois=rows5[0].nbrMT

    //obtenir  mes reclamation a affecter mois
    const sqlGet12 = "SELECT  count(id) as nbrRM from traitement where YEAR(date_affectation)=? and MONTH(date_affectation)=? and user_id=? ";      
    const [rows12, fields12] = await connection.execute(sqlGet12,[year,month,user.id]);
    dashboardData.traitementMois=rows12[0].nbrRM


  
        
//tableau

      
            // obtenir les reclamations 
            const sqlGet0 = "SELECT * from traitement where user_id=? order by date_affectation desc limit 5";      
            const [rows0, fields0] = await connection.execute(sqlGet0, [user.id,]);
            dashboardData.reclamations=rows0

            // obtenir mes 5 reclamations traiter
            const sqlGet6 = "SELECT * from reclamation where user_id=? order by date_reception desc limit 6  ";      
            const [rows6, fields6] = await connection.execute(sqlGet6,[user.id]);
            dashboardData.reclamations=rows6
    


       const traiterGet = "SELECT * from traitement where user_id=? order by date_affectation desc "; 
          const [rows7, fields7] = await connection.execute(traiterGet, [user.id]);
     
          const traitements = new Array();
          for (let i = 0; i < rows7.length; i++) {
            const traitement = rows7[i];
            const reclamationGet = "select * from reclamation where id=? and etat=?"; 
            const [rows1, fields1] = await connection.execute(reclamationGet, [
              traitement.reclamation_id,
              "Non traiter",
            ]);
           if(rows1[0]){
              traitement.reclamation_id = rows1[0];
              const userGet = "select * from user where id=? ";
              const [rows2, fields2] = await connection.execute(userGet, [
                traitement?.reclamation_id?.user_id,
              ]);
              traitement.reclamation_id.user_id = rows2[0];
              traitements.push(traitement);
            }
          }

          dashboardData.traitements=traitements.slice(0,5) 

//chart
      let i = 1;
  
      while (i <= month) {


    //obtenir  mes traitement
    const sqlGet5 = "SELECT  count(id) as nbrMT from traitement where YEAR(date_traitement)=? and MONTH(date_traitement)=? and user_id=?  "; 
    const [rows5, fields5] = await connection.execute(sqlGet5,[year,i,user.id]);
    dashboardData.traitementMois=rows5[0].nbrMT

    //obtenir  mes reclamation a affecter mois
    const sqlGet12 = "SELECT  count(id) as nbrRM from traitement where YEAR(date_affectation)=? and MONTH(date_affectation)=? and user_id=? ";      
    const [rows12, fields12] = await connection.execute(sqlGet12,[year,i,user.id]);
    dashboardData.reclamationMois=rows12[0].nbrRM

        dashboardData.lineTraitements?.datasets[0]?.data.push(rows5[0].nbrMT);
        dashboardData.lineReclamations?.datasets[0]?.data.push(rows12[0].nbrRM);
  
        i++;
      }
      }






      return response.json(dashboardData);
    } catch (error) {
      console.log(error);
    }
  });




  module.exports = router;