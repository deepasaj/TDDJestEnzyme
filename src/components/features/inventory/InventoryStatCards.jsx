import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Grid from "@material-ui/core/Grid";
import { useAuthAPI } from 'store/store';
import StatsCard from 'components/StatsCard'
import { useFeaturePermission } from './hooks';

const InventoryStatCards = () => {
  const history = useHistory()
  const authAPI = useAuthAPI()
  const [hasReadAccess] = useFeaturePermission()
  const [numberOfDevices, setNumberOfDevices] = useState(0)
  useEffect(() => {
    if(hasReadAccess) {
      authAPI.get(`/inventory/number_of_devices`)
        .then(({ data }) => {
          setNumberOfDevices(data.data);
        })
        .catch(() => {
          showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
        });
    }
  })
  return hasReadAccess && (
    <Grid item xs={3}>
      <StatsCard
        num={numberOfDevices} text="Devices in Inventory"
        handleQuickLink={() => history.push('/inventory/manage')}
      />
    </Grid>
  )
}

export default InventoryStatCards