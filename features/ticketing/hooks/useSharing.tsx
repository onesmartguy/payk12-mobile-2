import { transferTickets, TransferTicketsRequest } from "@/api/ticketing"
import { useMutation } from "@tanstack/react-query"





const useSharing = () => {
  const mutation = useMutation({
    mutationFn: transferTickets,
  })
  const sharePass = async (options: TransferTicketsRequest) => {
    var sharePassResults = await mutation.mutateAsync(options)
    return sharePassResults;
  }
  const shareTickets = async (options: TransferTicketsRequest) => {
    var shareTicketResults = await mutation.mutateAsync(options)
    return shareTicketResults;
  }

 
  
  const { isPending, isSuccess, reset, error } = mutation
  return {sharePass, isPending, isSuccess, reset, error, shareTickets} 
}

export default useSharing