import { ComponentButton } from "@/components";
import { useRentalStore } from "@/hooks"
import { KeyboardReturn, Print } from "@mui/icons-material";
import { Divider, Grid, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { useState } from "react";

const dividerStyle = {
  height: '2px',
  width: '70%',
  marginBottom: '15px',
  backgroundColor: '#085',
}

export const Concluded = () => {
  const { rentalSelected, postWarrantyReturn, getPrintWarrantyReturn, getPrintReturnWarrantyForm } = useRentalStore()
  const [disabled, setDisabled] = useState(true)
  const [loadingPrint, setLoadingPrint] = useState(false)
  const [loadingWarrantyReturn, setLoadingWarrantyReturn] = useState(false)
  const [loadingPrintReturn, setLoadingPrintReturn] = useState(false)

  const warrantyReturn = async () => {
    setLoadingWarrantyReturn(true)
    const body = {
      rental: rentalSelected.rental,
    }
    await postWarrantyReturn(body)
    setLoadingWarrantyReturn(false)
  }

  const printWarrantyRequest = async () => {
    setLoadingPrint(true)
    const res = await getPrintWarrantyReturn(rentalSelected.rental)
    if (res) {
      setDisabled(res => res ? !res : res)
    }
    setLoadingPrint(false)
  }

  const printWarrantyReturn = async () => {
    setLoadingPrintReturn(true)
    await getPrintReturnWarrantyForm(rentalSelected.rental)
    setLoadingPrintReturn(false)
  }

  return (
    <Box>
      <Grid container sx={{ padding: '20px 20px' }}>
        <Grid item xs={12} sm={7}>
          <Typography>Imprimir formulario de solicitud de garantía:</Typography>
        </Grid>
        <Grid item xs={12} sm={5} sx={{ marginBottom: 2 }}>
          <ComponentButton
            onClick={printWarrantyRequest}
            text="IMPRIMIR"
            startIcon={<Print />}
            loading={loadingPrint}
          />
        </Grid>
        <Divider style={dividerStyle} />
        <Grid item xs={12} sm={7}>
          <Typography>Imprimir conformidad:</Typography>
        </Grid>
        <Grid item xs={12} sm={5} sx={{ marginBottom: 2 }}>
          <ComponentButton
            onClick={printWarrantyReturn}
            text="IMPRIMIR"
            startIcon={<Print />}
            disable={disabled}
            loading={loadingPrintReturn}
          />
        </Grid>
        <Divider style={dividerStyle} />
        <Grid item xs={12} sm={7}>
          <Typography>Devolver garantía:</Typography>
        </Grid>
        <Grid item xs={12} sm={5}>
          <ComponentButton
            onClick={warrantyReturn}
            text="DEVOLVER"
            startIcon={<KeyboardReturn />}
            disable={disabled}
            loading={loadingWarrantyReturn}
            color={`warning`}
          />
        </Grid>
      </Grid>
    </Box>
  )
}