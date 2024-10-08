import React from 'react'
import { Text, View, SafeAreaView, ScrollView, ActivityIndicator, RefreshControl } from 'react-native'
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from 'react'

import { Company, Specifics, JobAbout, JobFooter, JobTabs, ScreenHeaderBtn } from '../../components'
import { COLORS, SIZES, icons } from '../../constants'
import { isLoaded } from 'expo-font'
import useFetch from '../../hook/useFetch'

const tabs = ["About", "Qualifications", "Responsibilities"];

const JobDetails = () => {
    const router = useRouter();
    const params = useLocalSearchParams();

    const { data, isLoading, error, refetch } = useFetch(
        'job-details', {
        job_id: params.id
        } 
    )

    const [refreshing, setRefreshing] = useState(false); 
    const [activeTab, setActiveTab] = useState(tabs[0]);

    // refresh page to refetch data
    const onRefresh = useCallback(() => {
        setRefreshing(true)
        refetch()
        setRefreshing(false)
    })

    const displayTabContent = () => {
        switch (activeTab) {
            case tabs[0]:
                return <JobAbout 
                    info={data[0].job_description ?? "N/A"} 
                />
                break;     
            case tabs[1]:
                return <Specifics 
                    title={tabs[1]}
                    points={data[0].job_highlights?.Qualifications ?? ['N/A']}
                />
                break;
            case tabs[2]:
                return <Specifics 
                    title={tabs[2]}
                    points={data[0].job_highlights?.Responsibilities ?? ['N/A']}
                />
                break; 
            default:
                return null;
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}
        >
            <Stack.Screen
                options={{
                    headerStyle: { backgroundColor: COLORS.lightWhite },
                    headerShadowVisible: false,
                    headerBackButtonMenuEnabled: false,
                    headerLeft: () => (
                        <ScreenHeaderBtn 
                            iconUrl={icons.left}
                            dimension="60%"
                            handlePress={() => router.push(`/`) }
                        />
                    ),
                    headerRight: () => (
                        <ScreenHeaderBtn 
                            iconUrl={icons.share}
                            dimension="60%"
                            handlePress={() => router.back }
                        />
                    ),
                    headerTitle: ""
                }}
            >  
            </Stack.Screen>

            {/* a react fragment */}
            <>
                <ScrollView 
                    showsHorizontalScrollIndicator={true} 
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefersh={onRefresh}/>
                    }
                    >

                    {isLoading ? (
                        <ActivityIndicator size="large" color={COLORS.primary}/>
                    ) : error ? (
                        <Text>Something went wrong</Text>
                    ) : data.length === 0 ? (
                        <Text>No data for this job</Text>
                    ) : (
                        <View style={{ padding: SIZES.medium, paddingBottom: 100 }}>
                            <Company
                                companyLogo={data[0].employer_logo}
                                jobTitle={data[0].job_title}
                                companyName={data[0].employer_name}
                                location={data[0].job_country}
                            />

                            <JobTabs 
                                tabs={tabs}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                            />

                            {displayTabContent()}
                        </View>
                    )}
                </ScrollView>

                <JobFooter url={data[0]?.job_apply_link ?? 'https://careers.google.com/jobs/results/'} />
                
            </>
        </SafeAreaView>
    )
}

export default JobDetails