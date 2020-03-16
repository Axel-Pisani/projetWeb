# projetWeb

BDD contiendra les tables :
 - user [id integer pk auto, pseudo varchar2(50), motDePasse varchar2(50), addresseDeLivraison varchar2(250), justificatifDeMajorité]
 - narguile [id integer pk auto, marque varchar2(50), référence varchar2(50), quantitéDeDispo integer(>=0), 
 noteDeUtilisateur integer(0<= val <=5), photo varchar2(150), idManche, idTuyau, idTete, idGout, idDiffuseur]
 - manche [id integer pk auto, quantitéDispointeger(>=0), description varchar2(200), photovarchar2(200)]
 - tuyau [id integer pk auto, quantitéDispointeger(>=0), description varchar2(200), photovarchar2(200)]
 - tête [id integer pk auto, quantitéDispointeger(>=0), description varchar2(200), photovarchar2(200)]
 - goût [id integer pk auto, quantitéDispointeger(>=0), description varchar2(200), photovarchar2(200)]
 - diffuseur [id integer pk auto, quantitéDispointeger(>=0), description varchar2(200), photovarchar2(200)]
 - location [idNarg, idManche, idTuyau, idTete, idGout, idDiffuseur]
