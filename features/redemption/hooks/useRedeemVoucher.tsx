
import { redeemVoucher } from '@/api/redemption';

import { useMutation, useQueryClient } from '@tanstack/react-query';


export const useRedeemVoucher = () => {
  const mutation = useMutation({
    mutationKey: ['redeemVoucher'], 
    mutationFn:  redeemVoucher,
    
  })

  return mutation
}

export default useRedeemVoucher