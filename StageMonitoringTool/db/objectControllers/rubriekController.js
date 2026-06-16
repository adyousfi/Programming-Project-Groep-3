import Rubriek from "../objectModel/rubriek.js";

// Belangrijk: Rubriek model (db/objectModel/rubriek.js) bevat enkel:
// - rubriek_id
// - score
// - beschrijving
// Er bestaat in dit model geen competentie_id, rubriektitel of rubriek_beschrijving.
// Daarom zorgt het huidige filteren op competentie_id + updaten van niet-bestaande velden
// ervoor dat rubrieken niet correct worden opgehaald.
//
// Dit bestand maakt de endpoints consistent met het bestaande Sequelize model:
// - GET /by-competentie/:competentie_id => retourneert alle rubrieken (zonder filter)
// - PUT /update-rubriek/:rubriek_id => update score + beschrijving
//
// UI kan later aangepast worden als er alsnog een competentie_id relatie/tabelveld komt.

const createRubriek = async (req, res, next) => {
  const { competentie_id, score, beschrijving, rubriek_beschrijving, rubriektitel } = req.body;

  if (!competentie_id) {
    return res.status(400).json({ msg: "competentie_id is verplicht" });
  }


  try {
    const rubriek = await Rubriek.create({
      competentie_id,
      score,
      beschrijving: beschrijving ?? rubriek_beschrijving ?? rubriektitel,
    });

    return res.status(200).json({
      msg: "Rubriek created successfully",
      data: rubriek,
    });
  } catch (error) {
    console.error("Error creating rubriek:", error);
    return res.status(500).json({
      msg: "something went wrong while creating rubriek",
    });
  }
};


const getRubriekenByCompetentie = async (req, res, next) => {
  const { competentie_id } = req.params;

  try {
    const rubrieken = await Rubriek.findAll({
      where: { competentie_id },
      order: [['rubriek_id', 'ASC']],
    });

    return res.status(200).json({ msg: "Rubrieken opgehaald", data: rubrieken });
  } catch (error) {
    console.error("Error fetching rubrieken:", error);
    return res.status(500).json({ msg: "something went wrong while fetching rubrieken" });
  }
};


const updateRubriek = async (req, res, next) => {
  const { rubriek_id } = req.params;
  const { score, beschrijving, rubriek_beschrijving, rubriektitel } = req.body;

  try {
    const rubriek = await Rubriek.findByPk(rubriek_id);
    if (!rubriek) return res.status(404).json({ msg: "Rubriek niet gevonden" });

    await rubriek.update({
      score,
      beschrijving: beschrijving ?? rubriek_beschrijving ?? rubriektitel,
    });

    return res.status(200).json({ msg: "Rubriek bijgewerkt", data: rubriek });
  } catch (error) {
    console.error("Error updating rubriek:", error);
    return res.status(500).json({ msg: "something went wrong while updating rubrieken" });
  }
};


export default { createRubriek, getRubriekenByCompetentie, updateRubriek };

