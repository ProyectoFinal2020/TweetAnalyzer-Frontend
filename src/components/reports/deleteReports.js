import { removeSelectedData } from "utils/localStorageManagement/selectedData";
import swal from "sweetalert";

export const updateSelectedData = (
  deletedReportsIds,
  selectedData,
  setSelectedData
) => {
  if (
    selectedData &&
    selectedData.report &&
    deletedReportsIds.includes(selectedData.report.id)
  ) {
    removeSelectedData();
    setSelectedData(undefined);
  }
};

export const showMsgConfirmation = (
  msg = "Una vez borrados, no podrás recuperar estas noticias"
) => {
  return swal({
    title: "¿Estás seguro?",
    text: msg,
    icon: "warning",
    buttons: {
      cancel: {
        text: "Cancelar",
        visible: true,
      },
      confirm: {
        text: "Continuar",
      },
    },
    dangerMode: true,
  });
};
